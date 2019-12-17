import Router from 'koa-router';
import * as ledgerCtrl from './ledger.ctrl';

const ledger = new Router();

ledger.post('/add', ledgerCtrl.addLedger);

export default ledger;
