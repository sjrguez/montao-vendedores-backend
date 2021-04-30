import { Router } from "express";

import GeneralController from "./controller";

const ROUTER: Router = Router();

/**
 * Path:
 *     /api/general/paises
 * Method:
 *    -GET
 * Response 
 * [
 *    {
 *       "_id": string,
 *       "nombre": string,
 *       "prefijo_telefono": string
 *    }
 * ]
 *
 * Error Response
 *  - status code = 500 
 *  - message
 */
ROUTER.get('/paises', GeneralController.getAllPaises);


module.exports =  ROUTER;
