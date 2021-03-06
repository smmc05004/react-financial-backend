import Router from 'koa-router';
import * as ledgerCtrl from './ledger.ctrl';

const ledger = new Router();

ledger.post('/add', ledgerCtrl.addLedger);
ledger.get('/lists', ledgerCtrl.ledgerList);
ledger.post('/read', ledgerCtrl.getLedger);
ledger.post('/update', ledgerCtrl.updateLedger);
ledger.post('/remove', ledgerCtrl.remove);
ledger.get('/analysis', ledgerCtrl.analysis);

export default ledger;
