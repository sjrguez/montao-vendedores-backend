import { Types } from 'mongoose'

import Logger from '../../../utils/logger';

const ComisionModel = require('./model');

const LoggerInstance = new Logger('Comision-Service')




interface FiltroInterface {
    tipo: 'all' | 'venta' | 'alquiter';
    marca: string;
    modelo: string;
}

export const getComision = async (filtro: FiltroInterface) => {

    let query = {
        estado: 1
    }

    if("all".localeCompare(filtro.marca) !== 0 && filtro.marca ) {
        const obj = {
            "vehiculo_indexado.marca.nombre": { $regex: new RegExp(`^${filtro.marca}`,'i')   }
        }
        query = Object.assign( query, obj )
    }

    if("all".localeCompare(filtro.modelo) !== 0 && filtro.modelo ) {
        const obj = {
            "vehiculo_indexado.modelo.nombre": { $regex: new RegExp(`^${filtro.modelo}`,'i')   }
        }
        query = Object.assign( query, obj )
    }

    try {
        let data;

        if(filtro.tipo.toLowerCase() === 'all') {
            data = await getAllComision(query);
        } else {
            const negocio: any = filtro.tipo
            data = await getComisionRentaOrDealers(negocio, query);
        }

        return data;
        
    } catch (error) {
        LoggerInstance.info( `Ha sucedido un error en getComision   ----- tipo = ${ filtro.tipo } | filtro = ${ {filtro} } `)
        throw error
    }
}

export const getComisionById = (id_comision: string) => {
    try {
        const data = ComisionModel.findOne({ _id: Types.ObjectId(id_comision), estado: 1})

        if(!data) throw {
            code: 404,
            message: 'Este vehiculo no existe o ha sido eliminado'
        }

        return data;
    } catch (error) {
        if( error.code != 404) {

            LoggerInstance.info(`Ha sucedido un error en getComisionById ---- id_comision = ${ id_comision }`)
            LoggerInstance.error( 'Ha sucedido un error al obtener comision por su id' , error)
        }
        throw {
            code: error.code == 404 ? 404: 500,
            message: error.code == 404 ? error.message : "No se pudo mostrar el vehiculos"
        }
    }
}

// ==================================================


const getAllComision = async (queryFilter: any) => {
    try {

        const matchQuery =  {
                $match: {
                    $expr:{
                        $eq: ['$_id','$$id'],
                    },
                    ...queryFilter 
                }
            }
        

        const query = [
            {
                $match: {
                    estado: 1
                }
            }, {
                $lookup: {
                    from: 'Vehiculos_dealers',
                    let: {
                        id: "$id_promocion"
                    },
                    pipeline: [
                        matchQuery,
                        {
                            $project: {
                                vehiculo_indexado: 1,
                                precio_vehiculo: '$precio_venta',
                                id_moneda: 1,
                                id_vehiculo: 1
                            }
                        }
                    ],
                    as: 'Vehiculo_dealer_lookup'
                }
            }, {
                $lookup: {
                    from: 'Vehiculos_rentas',
                    let: {
                        id: "$id_promocion"
                    },
                    pipeline: [
                        matchQuery,
                        {
                            $project: {
                                vehiculo_indexado: 1,
                                precio_vehiculo: '$precios.precio_general',
                                id_moneda: "$precios.id_moneda",
                                id_vehiculo: 1
                            }
                        }
                    ],
                    as: 'Vehiculo_renta_lookup'
                }
            },  {
                $addFields: {
                    vehiculo_publicado: {
                        $cond: [
                            {
                                $eq: [{$size: "$Vehiculo_renta_lookup"}, 0]
                            }, "$Vehiculo_dealer_lookup"
                            , "$Vehiculo_renta_lookup"
                        ]
                    }
                }
            }, {
                $unset: [ "Vehiculo_dealer_lookup", "Vehiculo_renta_lookup" ] 
            }, {
                $unwind: "$vehiculo_publicado"
            }
        ]
        const pipeline = await getPipeline(query)
        const data = await ComisionModel.aggregate(pipeline)
        return data;
    } catch (error) {
        LoggerInstance.info( 'Ha sucedido un error en getAllComision')
        LoggerInstance.error( 'Ha sucedido un error al mostrar todas las comisiones' , error)
        throw {
            code: 500,
            message: "No se pudo mostrar todos los vehiculos"
        }
    }
}


const getComisionRentaOrDealers = async (tipo: 'Alquiler' | 'Renta' ,queryMatch: any) => {

    const tipoNegocio = tipo == 'Alquiler' ? 'Vehiculos_rentas' : 'Vehiculos_dealers'
    const query = [
        {
            $match: {
                estado: 1,
                onModel: tipoNegocio
            }
        }, {
            $lookup: {
                from: tipoNegocio,
                let: {
                    id: "$id_promocion"
                },
                pipeline: [
                    {
                        $match: {
                            $expr:{
                                $eq: ['$_id','$$id'],
                            },
                            ...queryMatch

                        }
                    },
                    {
                        $project: {
                            vehiculo_indexado: 1,
                            precio_vehiculo: tipo == 'Alquiler' ? '$precios.precio_general' : '$precio_venta' ,
                            id_moneda: tipo == 'Alquiler' ? "$precios.id_moneda" : '$id_moneda',
                            id_vehiculo: 1
                        }
                    }
                ],
                as: 'vehiculo_publicado'
            }
        }, {
            $unwind: "$vehiculo_publicado"
        }
    ]


    try {
        const pipeline = await getPipeline(query)
        const data = await ComisionModel.aggregate(pipeline)
        return data;
    } catch (error) {
        LoggerInstance.info( `Ha sucedido un error en getComisionRenta  ----- tipo = ${ tipo } | queryMatch `, { queryMatch })
        LoggerInstance.error( 'Ha sucedido un error al mostrar las comisiones de renta cars' , error)
        throw {
            code: 500,
            message: "No se pudo mostrar todos los vehiculos"
        }
    }

}





const getPipeline = async (data: any[]) => {
    const lookupMoneda = {
        $lookup: {
            from: 'Monedas',
            let: { moneda: "$vehiculo_publicado.id_moneda" },
            pipeline: [ 
                {
                    $match: {
                        $expr: {
                            $eq: ['$_id', '$$moneda']
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        simbolo: 1
                    }
                }
            ],
            as: "Moneda_Lookup"
        }
    }

    
    const lookupVehiculo = {
        $lookup: {
            from: 'Vehiculos',
            let: { id_vehiculo: '$vehiculo_publicado.id_vehiculo' },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$_id', '$$id_vehiculo']
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        thumb: "$imgPerfil.thumb",
                    }
                }
            ],
            as: 'Vehiculo_Lookup'
        }
    }
    
    const lookupPagina = {
        $lookup:{
            from: 'Paginas',
            let: { id_pagina: '$id_pagina' },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ['$_id', '$$id_pagina']
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        codigo_pag: '$empresa.codigo_pag',
                        nombre_empresa: '$empresa.nombre_empresa',
                    }
                }
            ],
            as: 'Pagina_Lookup'
        }
    }


    const unwindMoneda = {
        $unwind: '$Moneda_Lookup'
    }
    const unwindVehiculo = {
        $unwind: '$Vehiculo_Lookup'
    }

    const unwindPagina = {
        $unwind: '$Pagina_Lookup'
    }

    const project = {
        $project: {
            nombre_vehiculo : {
                $concat: [ "$vehiculo_publicado.vehiculo_indexado.marca.nombre", " ", "$vehiculo_publicado.vehiculo_indexado.modelo.nombre", " ", '$vehiculo_publicado.vehiculo_indexado.year']
            },
            precio:'$vehiculo_publicado.precio_vehiculo',
            moneda: '$Moneda_Lookup.simbolo',
            comision: "$precio",
            imagen_vehiculo: '$Vehiculo_Lookup.thumb',
            transmision: '$vehiculo_publicado.vehiculo_indexado.transmision',
            id_pagina: 1
        }
    }


    const pipeline = [ 
        ...data,
        lookupMoneda,
        lookupVehiculo,
        lookupPagina,
        unwindMoneda,
        unwindVehiculo,
        unwindPagina,
        project
    ]
    return Promise.resolve(pipeline)
}


