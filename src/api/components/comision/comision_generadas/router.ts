import { Router } from "express";
import { verificarToken } from "../../middleware/auth.middleware";

import ComisionGeneradaController from "./controller";
const ROUTER: Router = Router();
ROUTER.use(verificarToken)

/**
 * Path:
 *     /comisiones_generadas/
 * Method:
 *      -Get
 *  Query params
 *     -from: Date
 *     -to: Date
 *  * Response
 *     "data": [
 *               {
 *                  "_id": null,
 *                  "total_comision": 421,
 *                  "comisiones": [
 *                        {
 *                     "_id": string,
 *                     "estado": number (si el estado es iguak a:
 *                                        1 = Pendiente
 *                                        2 = Aceptada
 *                                        3 = Cancelada,)
 *                     "fecha_creado": "2021-04-28T01:08:09.319Z",
 *                     "nombre_vehiculo": string,
 *                     "moneda": string,
 *                     "comision": number,
 *                     "nombre_empresa": string
 *                          }
 *                       ]
 *              }
 *           ]
 *  * Error Response
 *       - status code = 500
 *      - message
 *
 *
 */



ROUTER.get("/", ComisionGeneradaController.getAllMyComision);


/**
 * Path:
 *     /comisiones_generadas/
 * Method:
 *    -Post
 * params
 *   id_comision_vendedor: string;
 *   id_pagina: string;
 *   info_cliente: {
 *       nombre: string
 *       telefono: string
 *       direccion: string
 *       cedula: string
 *   };
 *   detalle_precio: {
 *       dias?: number (si es una renta car la pagina)
 *       precio: number
 *   };
 *    total_comision: number;
 * Response
 *   {
 *   "message": "Se ha enviado correctamente",
 *    }
 *
 * Error Response
 *  - status code = 500 | 404 | 400
 *  - message
 */
ROUTER.post("/", ComisionGeneradaController.generateComisionVendedor);

module.exports = ROUTER;
