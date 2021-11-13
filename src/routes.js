import {Router} from 'express';
import AuthController from './controllers/AuthController';
import RecoveryController from './controllers/RecoveryController';
import UserController from './controllers/UserController';
import checkCredentials from './middlewares/checkCredentials';

const routes = new Router();

routes.post('/auth', AuthController.store)

routes.post('/users', UserController.store)

routes.post('/recovery', RecoveryController.store)
routes.put('/recovery', RecoveryController.update)

routes.use(checkCredentials);
routes.get('/users', UserController.show)
routes.put('/users', UserController.update)
routes.delete('/users', UserController.delete)

export default routes;