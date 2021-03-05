import { Router } from 'express';

import LoginController from './controller'

const ROUTER: Router = Router();

ROUTER.post("/iniciarSesion", LoginController.login);
ROUTER.get("/closeSession", LoginController.closeSession);

module.exports = ROUTER
