import { Types } from 'mongoose'
import { hash, genSalt } from 'bcryptjs'

import Logger from '../../../utils/logger';

const UserModel = require('./model');


export interface UserInterface {
    nombre_completo: string
    correo: string
    password: string
    id_pais: string
    fecha_nacimiento: Date
    cedula?: string
    telefono?: string
    id_prefijo_telefono?: string
    direccion?: string
    _id: string;
    sexo?: string
    google?: string
    licencia?: string
    estado?: string
    estadoAdmin?: string
    fecha_modificacion?: Date
    fecha_eliminacion?: Date
}


const LoggerInstance = new Logger('Usuarios-Service')



export const createUser = async (data: UserInterface) => {

    const errorMessage = {
        message: 'No se pudo registrar este usuario',
        code: 500
    }

    try {
        await getUserByCorreo(data.correo);
    } catch (error) {
        let newError = error;
        if(error.code == 500) newError = errorMessage
        throw newError;
    }

    const userM = new UserModel ({
        nombre_completo: data.nombre_completo,
        correo: data.correo.toLowerCase(),
        password: await encriptarPassword(data.password),
        id_pais: data.id_pais
    })

    
    try {
        await userM.save();
        userM.password = ''
        return userM
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en createUser ---- user = ${ data }`)
        LoggerInstance.error( 'Ha sucedido un error al crear usuario ' , error)
        throw errorMessage;
    }

}


export const getUserById = async (userId: string) => {
    const errorMessage = {
        message: 'No se pudo obtener este usuario',
        code: 500
    }

    const dataNoRequerida = {
        estado: 0,
        estadoAdmin: 0,
        fecha_registro: 0,
        fecha_modificacion: 0,
        fecha_eliminacion: 0,
        password: 0
    }
    let user 
    try {
        user = await UserModel.findOne({_id: Types.ObjectId(userId), estado: 1 }, dataNoRequerida);
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en getUserById ---- id_user = ${ userId }`)
        LoggerInstance.error( 'Ha sucedido un error al obtener usuario por id' , error)
        throw errorMessage;
    }
    
    if(!user) throw {
        code: 404,
        message: 'Este usuario no existe o ha sido eliminado'
    }

    return user;
}


export const updateUser = async (data: UserInterface, id_user: string) => {
    try {
        await getUserById(id_user)
        await getUserByCorreo(data.correo, id_user)
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en updateUser-(getUserById/getUserByCorreo) ---- `, { data, id_user })
        throw error
    }


    try {
        data.fecha_modificacion = new Date();
        await UserModel.updateOne({_id: Types.ObjectId(id_user)}, data)
        return {
            message: "Usuario actualizado"
        }
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en updateUser ---- id_user = ${ id_user } | data = ${ data }`)
        LoggerInstance.error( 'Ha sucedido un error al modificar usuario' , error)

        throw  {
            code: 500,
            message: 'No se pudo modificar el usuario'
        }
    }
  
}

// =========== General functions ==========

async function getUserByCorreo(correo:  string, id?: string) {
    
    let query: any = {
        correo: correo.toLowerCase(),
    }
    if(id) {
        query._id = {
            $nin: id
        }
    }

    try {
        const data = await UserModel.findOne(query)
        if(!data) return true        
        if(data.estado == 1) throw { code: 400, message: 'Este correo esta siendo usado' }
        if(data) throw { code: 400, message: 'Este correo no esta disponible' }

    } catch (error) {
        if(error.code == 400) throw error;

        LoggerInstance.info(`Ha sucedido un error en getUserByCorreo ---- correo = ${ correo }`)
        LoggerInstance.error( 'Ha sucedido un error al obtener el usuario por su correo' , error)
        throw  {
            code: 500
        }
    }
}



const encriptarPassword = async (password: string) => {
    const salt = await genSalt();
    return await hash(password, salt)
}
