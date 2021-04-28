import { Request, Response } from 'express';


import { returnErrorResponse } from '../../../utils/response';
import { RequestType } from '../../../utils/general';

import * as UserService from './service';

async function createUser(req: Request, res: Response) {
    const datos = req.body;
    try {
        await UserService.createUser(datos)
        return res.status(201).json({
            message: 'Usuario creado',
            ok: true
        })
    } catch (error) {
        return returnErrorResponse(res, error)
    }
}


async function getUserById(req: any, res: Response) {
    
    let userID = req.params.id // req.id_usuario
    try {
        const data = await UserService.getUserById(userID)
        return res.json(data);
    } catch (error) {
        return returnErrorResponse(res, error)
    }
}


async function updateUser(req: any, res: Response) {
    let userID = req.params.id // req.id_usuario
    let data = req.body
    try {
        const resp = await UserService.updateUser(data,userID)
        return res.json(resp);
    } catch (error) {
        return returnErrorResponse(res, error)
    }
}

const UserController = {
    createUser,
    getUserById,
    updateUser
}


export default UserController;