import {  Response, Request } from 'express'
import { verify } from "jsonwebtoken";
import { SEED } from "../../../config/enviroment";


export const verificarToken = async (req: any, res: Response, next: any) => {

	try {
		const token: any = req.signedCookies["wpl"] || false;

		const resp: any =  verify(token, SEED)
		req.id_usuario = resp.id_usuario
		console.log(resp);
		
		next();
	} catch (error) {
		 res.status(401).json({
			message: "Por favor debe volver a inciar sesion"
		})
	}

}
