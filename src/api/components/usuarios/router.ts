import { Router } from 'express';

import UserController from './controller'

const ROUTER: Router = Router();

/**
 * Path:
 *     /api/user/
 * Method:
 *    -Post
 *  Body params
 *    - nombre_completo: string obligatorio
 *    - correo: string obligatorio
 *    - password: string obligatorio
 *    - id_pais: string obligatorio
 * Response 
 *     {
 *       message: 'Usuario creado',
 *       ok: true    
 *     }
 *
 * Error Response
 *  - status code = 500 | 400
 *  - message
 */
ROUTER.post('/', UserController.createUser)

/**
 * Path
 *     - /api/user/${id_usuario}
 *  Method:
 *     -Get
 * Params
 *    - id: string
 * 
 * Response:
 *    {
 *        nombre_completo: string
 *        correo: string
 *        password: string
 *        id_pais: string
 *        fecha_nacimiento: Date
 *        cedula?: string
 *        telefono?: string
 *        id_prefijo_telefono?: string
 *        direccion?: string
 *        _id: string
 *        sexo?: string
 *        google?: string
 *        licencia?: string
 *    }
 * 
 * Error Response
 *      - status code = 500 | 404
 *      - message
 * 
 */

ROUTER.get('/:id', UserController.getUserById)


/**
 * Path
 *     - /api/user/${id_usuario}
 *  Method:
 *     -Put
 * Params
 *    - id: string
 * 
 *  Body Params:
 *     
 *   {
 *        nombre_completo: string ------obligatorio
 *        correo: string ------obligatorio
 *        password: string ------obligatorio
 *        id_pais: string  ------obligatorio
 *        fecha_nacimiento: ------ Date
 *        cedula?: string
 *        telefono: ------string
 *        id_prefijo_telefono?: ------ string
 *        direccion?: ------string
 *        _id: string
 *        sexo?: string
 *        google?: string
 *        licencia?: string
 *    }
 * 
 * Response:
 *    {
 *        message: string
 *    }
 * 
 * Error Response
 *      - status code = 500 | 404
 *      - message
 * 
 */

ROUTER.put('/:id', UserController.updateUser)


module.exports = ROUTER
