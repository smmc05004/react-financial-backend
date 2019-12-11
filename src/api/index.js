import Router from 'koa-router';
import ledger from './ledger';

const api = new Router();

api.use('/ledger', ledger.routes());

export default api;
