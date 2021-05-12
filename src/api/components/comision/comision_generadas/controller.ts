import { Request, Response } from 'express';
import { getUserIdFromReq } from '../../../../utils/general';


import { returnErrorResponse } from '../../../../utils/response';

import * as ComisionesGeneradasService from './service';


async function generateComisionVendedor (req: Request, res: Response) {
    try {
        const body = req.body;
        const id_vendedor = "608f37ab9d6cb80982d9cee4"

        await ComisionesGeneradasService.generateComision(id_vendedor, body)

        return res.status(201).json({
            message: "Se ha enviado correctamente"
        })
    } catch (error) {
        return returnErrorResponse(res, error)
    }
}

async function getAllMyComision (req: Request, res: Response) {
    
    try {
        const filtro: any = req.query;
        const id_usuario =  "608f37ab9d6cb80982d9cee4"
        
        const data = await ComisionesGeneradasService.getAllMyComisionGenerate(id_usuario, filtro)
        
        res.json({data})
    } catch (error) {
        return returnErrorResponse(res, error)
    }
}

const MiCatalogoController = {
    generateComisionVendedor,
    getAllMyComision
}


export default MiCatalogoController;