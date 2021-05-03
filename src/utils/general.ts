
import { Request } from 'express'



export const getUserIdFromReq = (req: Request) =>{ 
    return req.signedCookies['uid:']
}