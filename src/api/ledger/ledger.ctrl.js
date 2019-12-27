/* eslint-disable no-dupe-keys */
/* eslint-disable require-atomic-updates */
import Ledger from '../../models/ledger';

export const addLedger = async ctx => {
  const {
    type,
    category,
    title,
    place,
    amount,
    date,
    use,
    user,
  } = ctx.request.body;

  const ledger = new Ledger({
    type,
    category,
    title,
    place,
    amount,
    date,
    use,
    user,
  });

  try {
    await ledger.save();
    ctx.body = ledger;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const ledgerList = async ctx => {
  const { userId, period } = ctx.query;
  const pageNum = parseInt(ctx.query.pageNum || '1', 10);

  const { firstDate, lastDate } = getStartEndDate(period);

  if (pageNum < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const list = await Ledger.find()
      .where('user.userId')
      .equals(userId)
      .where('use')
      .equals('Y')
      .where('date')
      .gte(firstDate)
      .where('date')
      .lte(lastDate)
      .sort({ date: -1 })
      .limit(10)
      .skip((pageNum - 1) * 10)
      .exec();
    const totalCount = await Ledger.countDocuments({
      'user.userId': userId,
      date: { $gte: firstDate },
      date: { $lte: lastDate },
      use: 'Y',
    }).exec();

    ctx.body = { list, totalCount };
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getLedger = async ctx => {
  const { id } = ctx.request.body;
  try {
    const ledger = await Ledger.findById(id).exec();
    if (!ledger) {
      ctx.status = 404;
      return;
    }
    ctx.body = ledger;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const updateLedger = async ctx => {
  const { id } = ctx.request.body;
  try {
    const ledger = await Ledger.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    if (!ledger) {
      ctx.status = 404;
      return;
    }
    ctx.body = ledger;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const remove = async ctx => {
  const { idArr } = ctx.request.body;
  const removed = [];

  try {
    for (let i = 0; i < idArr.length; i++) {
      const removedLedger = await Ledger.findOneAndUpdate(
        { _id: idArr[i] },
        {
          $set: { use: 'N' },
        },
        {
          new: true,
        },
      );

      removed.push(removedLedger._id);
    }
    ctx.body = removed;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const analysis = async ctx => {
  const expense = { label: [], data: [] };
  const income = { label: [], data: [] };
  const sum = { type: [], data: [] };

  const { userId, period } = ctx.query;
  const { firstDate, lastDate } = getStartEndDate(period);

  try {
    const expenseResult = await Ledger.aggregate([
      {
        $match: {
          $and: [
            { 'user.userId': userId },
            { use: 'Y' },
            { date: { $gte: new Date(firstDate) } },
            { date: { $lte: new Date(lastDate) } },
            { type: 'expense' },
          ],
        },
      },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const incomeResult = await Ledger.aggregate([
      {
        $match: {
          $and: [
            { 'user.userId': userId },
            { use: 'Y' },
            { date: { $gte: new Date(firstDate) } },
            { date: { $lte: new Date(lastDate) } },
            { type: 'income' },
          ],
        },
      },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    const sumResult = await Ledger.aggregate([
      {
        $match: {
          $and: [
            { 'user.userId': userId },
            { use: 'Y' },
            { date: { $gte: new Date(firstDate) } },
            { date: { $lte: new Date(lastDate) } },
          ],
        },
      },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);

    for (let i = 0; i < expenseResult.length; i++) {
      const ex = expenseResult[i];
      expense.label.push(ex._id);
      expense.data.push(ex.total);
    }
    for (let i = 0; i < incomeResult.length; i++) {
      const inc = incomeResult[i];
      income.label.push(inc._id);
      income.data.push(inc.total);
    }
    for (let i = 0; i < sumResult.length; i++) {
      const su = sumResult[i];
      sum.type.push(su._id);
      sum.data.push(su.total);
    }
    ctx.body = { expense, income, sum };
  } catch (e) {
    ctx.throw(500, e);
  }
};

function getStartEndDate(period) {
  const firstDate = `${period}-01`;

  const yyyy = period.substring(0, 4);
  const mm = period.substring(5);

  const monthLastDate = new Date(yyyy, mm, 0).getDate();
  const lastDate = `${period}-${monthLastDate}`;

  return { firstDate, lastDate };
}
