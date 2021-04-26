import { Router } from 'express';

import MiCatalogoController from "./controller";

const ROUTER: Router = Router();


/**
 * Path:
 *     /mi_catalogo/
 * Method:
 *      -Get
 *  Query params
 * 
 *      - tipo: string; 
 *      - marca?: string;
 *      - modelo?: string;
 *  * Response
 *  [
 *     {
 *      - _id: string,
 *      - id_pagina: string,
 *      - nombre_vehiculo: string,
 *      - precio: number,
 *      - moneda: string,
 *      - comision: number,
 *      - imagen_vehiculo: string,
 *      - transmision: string,
 *      - nombre_empresa: string
 *     }
 * ]
 *  * Error Response
 *       - status code = 500
 *      - message
 * 
 * 
 */

ROUTER.get('/', MiCatalogoController.getMiCatalogo)

/**
 * Path:
 *     /mi_catalogo/
 * Method:
 *    -Get
 * params
 *   - id_vendedor: string
 *   - id_comision: string
 * Response
 *   {
 *   "message": "Se ha enviado solicitud correctamente",
 *   "paginaInfo": [
 *       {
 *           "_id": "60580ccb0917f5362acca6d3",
 *           "contactos": [],
 *           "nombre_empresa": "asdasd"
 *       }
 *     ]
 *    }
 * 
 * Error Response
 *  - status code = 500 | 404 | 400
 *  - message
 */

ROUTER.post('/', MiCatalogoController.addToMiCatalogo)

module.exports = ROUTER
