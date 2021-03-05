import { Router } from 'express';

import MiCatalogoController from "./controller";

const ROUTER: Router = Router();


ROUTER.get('/', MiCatalogoController.getMiCatalogo)

ROUTER.post('/', MiCatalogoController.addToMiCatalogo)

module.exports = ROUTER
