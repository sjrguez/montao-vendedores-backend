import { Router } from 'express';

import LoginController from './controller'

const ROUTER: Router = Router();


/**
 * Path
 *     - /api/login
 *  Method:
 *     -POST
 * Body params
 *    - correo: string;
 *    - password: string;
 * 
 * Response:(guardar la respuesta en el localstore asi sea facil obtener informacion del usuario)
 *    {
 *        "token": string,
 *        "usuario": {
 *            "google": boolean,
 *            "estado": number,
 *            "_id": string,
 *            "nombre_completo": string,
 *            "correo": string,
 *            "password": "",
 *            "id_pais": string,
 *            "__v": 0
 *        },
 *        "message": "Se ha iniciado sesion"
 *    }
 * Error Response
 *      - Status code = 500 | 400
 *      - message
 * 
 */
ROUTER.post("/iniciarSesion", LoginController.login);

/**
 * Path:
 *     /api/login
 * Method:
 *    -GET
 * Response 
 * { ok: true }
 *
 * Error Response
 *  - status code = 500 
 *  - message
 */

ROUTER.get("/closeSession", LoginController.closeSession);

module.exports = ROUTER
