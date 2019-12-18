/* eslint-disable require-atomic-updates */
import Ledger from '../../models/ledger';

export const addLedger = async ctx => {
  const { type, category, title, place, amount, user } = ctx.request.body;

  const ledger = new Ledger({
    type,
    category,
    title,
    place,
    amount,
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
  const pageNum = parseInt(ctx.query.pageNum || '1', 10);

  if (pageNum < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const list = await Ledger.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((pageNum - 1) * 10)
      .exec();
    const totalCount = await Ledger.countDocuments().exec();
    ctx.body = { list, totalCount };
  } catch (e) {
    ctx.throw(500, e);
  }
};
