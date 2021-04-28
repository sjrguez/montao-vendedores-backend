import { compareSync } from "bcryptjs";
import Logger from "../../../utils/logger";

import { SEED, ExpireTimeJTW } from "./../../../config/enviroment";
import { sign } from 'jsonwebtoken'
import { UserInterface } from "../usuarios/service";

const UsuarioModel = require("../usuarios/model");
const LoggerInstance = new Logger("Login-Service");

export const login = async (email: string, password: string) => {

  if(!email || !password) {
    throw {
      error: 400,
      message: "Debe ingresar su correo y contraseña "
    }
  }
  
  try {
    const user: any = await UsuarioModel.findOne(
      { correo: email, estado: { $lte: 2 } },
      { estadoAdmin: 0,  fecha_registro: 0,  fecha_modificacion: 0,  fecha_eliminacion: 0 }
    );
    
    
    if (!user || !compareSync(password, user.password)) throw {
        code: 400,
        message: "El correo o lacontraseña que ingresaste son incorrecta.",
      };

    if (user.estado == 2) throw {
        code: 400,
        message: "El usuario se encuentra desactivado.",
      };

    const token = await generateToken(user);
    
    user.password = ''
    
    return {
      token,
      usuario: user
    };

  } catch (error) {
      if(error.code !== 400) {
        LoggerInstance.info(`Ha sucedido un error en login ---- correo = ${ email } | password = ${ { password } }`)
        LoggerInstance.error( 'Ha sucedido un error al iniciar sesion' , error)
      }


    throw {
      message: error.message ? error.message : "No se pudo iniciar sesión.",
      code: error.code ? error.code : 500,
    };
  }
};



// ================


const generateToken = async (userData: UserInterface) => {
  try {
    var token = sign({ id_usuario: userData._id }, SEED, {
      expiresIn: ExpireTimeJTW,
    });

    return token;
  } catch (error) {
    LoggerInstance.info(`Ha sucedido un error en generateToken ----}`, { usuario: userData })
    LoggerInstance.error( 'Ha sucedido un error al generar token' , error)
    throw error;
  }
}