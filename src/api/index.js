import Router from 'koa-router';
import ledger from './ledger';
import auth from './auth';

const api = new Router();

api.use('/ledger', ledger.routes());
api.use('/auth', auth.routes());

export default api;
