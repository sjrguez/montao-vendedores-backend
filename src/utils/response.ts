import {  Response,Request } from 'express';

interface ResponseHttpError {
    message: string,
    code: number
    description?: string
}


export const returnErrorResponse = (res: Response, error: ResponseHttpError ) => {
    return res.status(error.code).json({
        message: error.message,
        description: error.description
    })
}

