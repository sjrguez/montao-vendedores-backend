import { Request, Response } from 'express';


import { returnErrorResponse } from '../../../../utils/response';
import { getUserIdFromReq } from '../../../../utils/general';

import * as MiCatalogoService from './service';


async function getMiCatalogo(req: Request, res: Response) {

     try {
         const info: any = req.query
         const filtro: MiCatalogoService.FiltroInterface = info;
         
        const id_vendedor = getUserIdFromReq(req)
        const data = await MiCatalogoService.getMiCatalogo(id_vendedor, filtro)
        return res.json(data)
    } catch (error) {
        return returnErrorResponse(res, error)
    }

}

async function addToMiCatalogo(req: Request, res: Response) {

    try {
        const data = req.body;
        data.id_vendedor = getUserIdFromReq(req)
        
        const info = await MiCatalogoService.addToMiCatalogo(data)
        return res.status(201).json({
            message: 'Se ha enviado solicitud correctamente',
            paginaInfo: info.pagina
        })
    } catch (error) {
        return returnErrorResponse(res, error)
    }
}
 


const MiCatalogoController = {
    getMiCatalogo,
    addToMiCatalogo
}


export default MiCatalogoController;