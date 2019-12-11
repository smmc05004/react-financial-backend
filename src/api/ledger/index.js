import Router from 'koa-router';

const ledger = new Router();

ledger.get('/', ctx => {
  console.log('가계부 가져오기');
});

export default ledger;
