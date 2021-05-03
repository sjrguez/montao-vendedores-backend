import { Router } from "express";
import { verificarToken } from "../middleware/auth.middleware";

import ComisionController from "./controller";

const ROUTER: Router = Router();

ROUTER.use(verificarToken)

/**
 * Path
 *     - /api/vehiculos
 *  Method:
 *     -Get
 * Query params
 *    - tipo: 'all' | 'venta' | 'alquiter';
 *    - marca: string;
 *    - modelo: string;
 * 
 * Response:
 *     [
 *       {
 *       - _id: String,
 *       - id_pagina: string,
 *       - nombre_vehiculo: string,
 *       - precio: number,
 *       - moneda: string,
 *       - comision: number,
 *       - imagen_vehiculo: string,
 *       - transmision: string
 *       
 *       }
 *     ]
 * 
 * Error Response
 *      - message
 * 
 */
ROUTER.get("/", ComisionController.getAllComision);

module.exports = ROUTER;
