/* eslint-disable require-atomic-updates */
import Ledger from '../../models/ledger';

export const addLedger = async ctx => {
  const { type, category, title, place, amount, user } = ctx.request.body;
  console.log('받은 파라미터: ', type, category, title, place, amount, user);

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
    console.log('ledger: ', ledger);
  } catch (e) {
    ctx.throw(500, e);
  }
};
