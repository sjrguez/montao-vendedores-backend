import { Router } from "express";

import MiCatalogoController from "./controller";
import  { verificarToken } from '../../middleware/auth.middleware'

const ROUTER: Router = Router();


ROUTER.use(verificarToken)
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

ROUTER.get("/", MiCatalogoController.getMiCatalogo);

/**
 * Path:
 *     /mi_catalogo/
 * Method:
 *    -Post
 * params
 *   - id_vendedor: string
 *   - id_comision: string
 * Response
 *   {
 *   "message": "Se ha enviado solicitud correctamente",
 *   "paginaInfo": [
 *        {
 *          "_id": "6088b10b08f33c0fc503c926",
 *          "contactos": [
 *              {
 *                  "contacto": string,
 *                  "titulo": string
 *              }
 *          ],
 *          "nombre_empresa": "cambie el nombre 2"
 *      }
 *     ]
 *    }
 *
 * Error Response
 *  - status code = 500 | 404 | 400
 *  - message
 */

ROUTER.post("/", MiCatalogoController.addToMiCatalogo);

module.exports = ROUTER;
