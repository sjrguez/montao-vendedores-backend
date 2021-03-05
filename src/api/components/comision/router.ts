import { Router  } from 'express';

import ComisionController from "./controller";

const ROUTER: Router = Router();


ROUTER.get('/',ComisionController.getAllComision)

module.exports = ROUTER
