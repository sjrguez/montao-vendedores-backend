import { Types } from 'mongoose'

import Logger from '../../../../utils/logger';
import { getSolicitudVendedorById } from '../mi_catalogo/service';

const ComisionGeneradaModel = require('./model');

const LoggerInstance = new Logger('ComisionGenerada-Service');


interface ComisionGeneradaInterface {
    id_comision_vendedor: string;
    id_pagina: string;
    info_cliente: {
        nombre: string
        telefono: string
        direccion: string
        cedula: string
    };
    detalle_precio: {
        dias?: number
        precio: number
    };
    total_comision: number;
}


export const generateComision = async (id_usuario: string, data: ComisionGeneradaInterface) => {

    const errorMessage = {
        code: 500,
        message: "No se pudo vender/alquilar este vehiculo"
    }
    try {
        const solicitud = await getSolicitudVendedorById(data.id_comision_vendedor);
        if(!solicitud) throw {
            code: 400,
            message: "No existe este vehiculo o ha sido eliminado"
        }
        if(solicitud.estado == 1) throw {
            code: 400,
            message: "No puede vender/alquilar este vehiculo hasta que el dealer/rentacar acepte la solicitud"
        }
        if(solicitud.estado == 3) throw {
            code: 400,
            message: "No puede vender/alquilar este vehiculo hasta que el dealer/rentacar acepte la solicitud"
        }
    } catch (error) {
        
        if(error.code != 400 )LoggerInstance.info(`Ha sucedido un error en generateComision ---- id_comision_vendedor = ${ data.id_comision_vendedor }`)
        throw error.code == 400 ? error : errorMessage;
    }


    try {
        const generate = new ComisionGeneradaModel({
            id_vendedor: id_usuario,
            ...data
        })
        
        await generate.save();
        return generate; 
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en generateComision ---- id_usuario = ${ id_usuario } | data = ${ { data } }`)
        LoggerInstance.error( 'Ha sucedido un error al generar comision al vendedor' , error)
        
        throw errorMessage;
    }
}


export const getAllMyComisionGenerate = async (id_usuario: string, filtro: {from: Date, to: Date} ) => {
    
    const queryMatch: any = {
        id_vendedor: Types.ObjectId(id_usuario)
    }


    if(filtro.from) {
        queryMatch.fecha_creado = {
            $gte: filtro.from
        }
    }

    if(filtro.to) {
        queryMatch.fecha_creado = {
            $lte: filtro.to
        }
    }
    if(filtro.from && filtro.to) {
        queryMatch.fecha_creado = {
            $gte: filtro.from,
            $lte: filtro.to
        }
    }

    const matchQuery =  {
        $match: {
            $expr:{
                $eq: ['$_id','$$id'],
            }
        }
    }


    try {
        const query = [
            {
                $match: queryMatch
            }, {
                $lookup: {
                    from: "Comisiones_vendedores",
                    let: {
                        id: "$id_comision_vendedor"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', "$$id"]
                                }
                            }
                        },{
                            $project: {
                                id_comision: 1
                            }
                        }
                    ],
                    as: "ComisionVendedor_Lookup"
                }
            }, {
                $unwind: "$ComisionVendedor_Lookup"
            }, {
                $lookup: {
                    from: 'Comisiones',
                    let: {
                        id_comision: '$ComisionVendedor_Lookup.id_comision'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr:{
                                    $eq: ['$_id','$$id_comision'],
                                }
                            }
                        }, {
                            $project: {
                                id_promocion: 1,
                            }
                        }
                    ],
                    as: 'Comision_Lookup'
                }
            }, {
                $unwind: "$Comision_Lookup"
            }, {
                $lookup: {
                    from: 'Vehiculos_dealers',
                    let: {
                        id: "$Comision_Lookup.id_promocion"
                    },
                    pipeline: [
                        matchQuery,
                        {
                            $project: {
                                vehiculo_indexado: 1,
                                id_moneda: 1,
                            }
                        }
                    ],
                    as: 'Vehiculo_dealer_lookup'
                }
            }, {
                $lookup: {
                    from: 'Vehiculos_rentas',
                    let: {
                        id: "$Comision_Lookup.id_promocion"
                    },
                    pipeline: [
                        matchQuery,
                        {
                            $project: {
                                vehiculo_indexado: 1,
                                id_moneda: "$precios.id_moneda",
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
        const data = await ComisionGeneradaModel.aggregate(pipeline)

        return data;
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en getAllMyComisionGenerate ---- id_vendedor = ${ id_usuario } | filtro = ${ { filtro } }`)
        LoggerInstance.error( 'Ha sucedido un error al obtener todas las comisiones del vendedor' , error)
        
        throw {
            code: 500,
            message: "No se pudo mostrar todas las comisiones generadas"
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
            comision: "$total_comision",
            estado: 1,
            nombre_empresa: "$Pagina_Lookup.nombre_empresa",
            fecha_creado: 1
        }
    }


    const pipeline = [ 
        ...data,
        lookupMoneda,
        lookupPagina,
        unwindMoneda,
        unwindPagina,
        project
    ]
    return Promise.resolve(pipeline)
}