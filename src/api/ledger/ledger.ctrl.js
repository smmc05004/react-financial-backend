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
