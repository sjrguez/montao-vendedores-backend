import { Request, Response } from 'express';


import { returnErrorResponse } from '../../../utils/response';

import * as GeneralService from './service';


async function getAllPaises (req: Request, res: Response) {

    try {
        const data = await GeneralService.getPaises();
        return res.json(data);
    } catch (error) {
        return returnErrorResponse(res, error)
    }


}


const GeneralController = {
    getAllPaises
}

export default GeneralController;
