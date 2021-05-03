import Logger from '../../../utils/logger';

const PaisModel = require('../shared_models/pais.model')

const LoggerInstance = new Logger('General-Service')




export const getPaises = async() => {
    try {
        const data = await PaisModel.find({estado: true}, { nombre: 1, prefijo_telefono:1 })
        return data
    } catch (error) {
        LoggerInstance.info( 'Ha sucedido un error en getPaises')
        LoggerInstance.error( 'Ha sucedido un error al mostrar los paises' , error)
        throw {
            code: 500,
            message: "No se pudo mostrar los paises"
        }
    }
}


