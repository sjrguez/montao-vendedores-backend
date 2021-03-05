import { Request, Response } from 'express';


import { returnErrorResponse, getUserIdInRequest } from '../../../utils/response';

import * as ComisionService from './service';


async function getAllComision(req: Request, res:Response) {
    try {
        const filtro: any =  req.query;
        const data = await ComisionService.getComision(filtro)
        return res.json(data)
    } catch (error) {
        return returnErrorResponse(res, error)
    }
}


const ComisionController = {
    getAllComision
}


export default ComisionController;