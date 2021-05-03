import { Request, Response } from "express";
import { ExpireTimeJTW } from "../../../config/enviroment";

import * as UserService from "./service";

const login = async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;
    
    const data = await UserService.login(correo, password);
    res = await saveCookie(data, res);

    res.json({
      ...data,
      message: "Se ha iniciado sesion"
    });
  } catch (error) {
    const err = {
      code: error.code ? error.code : 500,
      message: error.message ? error.message : "No se pudo iniciar sesión.",
    };

    res = await cerrarSesion(res)
    return res.status(err.code).json({
      message: err.message,
    });
  }
};


const closeSession = async (req: Request, res: Response) => {
  try {
    res = await cerrarSesion(res);
    res.json({ ok: true });
  } catch (error) {
    res.status(500);
  }
};



// =============

const saveCookie = (data: {token: string, usuario: any}, res: Response) => {
  res.cookie("wpl", data.token, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + ExpireTimeJTW),
    secure: true
  });
  
  
  res.cookie("uid", data.usuario._id, {
    httpOnly: true,
    signed: true,
    expires: new Date(Date.now() + ExpireTimeJTW),
    secure: true
  });

  return Promise.resolve(res);
};

const cerrarSesion = (res: Response) => {
  res.clearCookie("wpl");
  res.clearCookie("uid");
  return Promise.resolve(res);
}

const LoginController = {
  login,
  closeSession,
};

export default LoginController;
