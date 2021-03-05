import { Router, Request, Response } from 'express';

import ComisionGeneradaController from "./controller";
const ROUTER: Router = Router();


ROUTER.get('/', ComisionGeneradaController.getAllMyComision)
ROUTER.post('/', ComisionGeneradaController.generateComisionVendedor)

module.exports = ROUTER
