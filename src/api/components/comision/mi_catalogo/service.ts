import { Types } from 'mongoose'

import Logger from '../../../../utils/logger';
import { getComisionById } from '../service';

const ComisionVendedorModel = require('./model');
const ComisionModel = require('../model');

const LoggerInstance = new Logger('ComisionVendedor-Service')

interface ComisionVendedorInterface {
    id_vendedor: string
    id_comision: string
}

export interface FiltroInterface {
    tipo: string; 
    marca?: string;
    modelo?: string;
}

export const getMiCatalogo = async (id_vendedor: string, filtro: FiltroInterface) => {
        
    let query = {
        estado: 1
    }

    if(filtro.marca && "all".localeCompare(filtro.marca) !== 0 ) {
        const obj = {
            "vehiculo_indexado.marca.nombre": { $regex: new RegExp(`^${filtro.marca}`,'i')   }
        }
        query = Object.assign( query, obj )
    }

    if(filtro.modelo &&  "all".localeCompare(filtro.modelo) !== 0  ) {
        const obj = {
            "vehiculo_indexado.modelo.nombre": { $regex: new RegExp(`^${filtro.modelo}`,'i')   }
        }
        query = Object.assign( query, obj )
    }

    try {
        let info;
       
        if(filtro.tipo.toLowerCase() === 'all') {
            info = await getAllMiCatalogo(id_vendedor, query);
        } else {
            
            const params: any = { 
                id_vendedor: id_vendedor,
                matchQuery: query,
                tipo: filtro.tipo
            }
            info = await getMiCatalogoRentaOrDealers( params );
        }
            
        return info;
        
    } catch (error) {
        LoggerInstance.info( `Ha sucedido un error en miCatalogo   ----- tipo = ${ filtro.tipo } | filtro = ${ {filtro: filtro} } | id_vendedor = ${ id_vendedor }`)
        throw error
    }
}


export const addToMiCatalogo = async (data: ComisionVendedorInterface) => {
    const errorMessage = {
        code: 500,
        message: 'No se pudo registrar este vehiculo'
    }

    try {
        await getComisionById(data.id_comision);
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en createComisionVendedor-getComisionById ---- data `, { data })
        throw error.code == 404 ? error : errorMessage    
    }


    try {
        const query = {
            estado: {
                $lte: 2 
            },
            id_comision: data.id_comision
        }
        const info = await ComisionVendedorModel.findOne(query)
        console.log({info, id_comision: data.id_comision});
        
        if(info) throw {
            code: 400,
            message: info.estado == 1 ? 'Ya ha enviado una solicitud a este vehiculo' : 'Ya tiene registrado este vehiculo'
        }
        
    } catch (error) {
        if(error.code != 400) {
            LoggerInstance.info(`Ha sucedido un error en createComisionVendedor ---- data `, { data })
            LoggerInstance.error( 'Ha sucedido un error al confimar si ya se ha enviado la solicitud anteriormente' , error)
        }

        throw error.code == 400 ? error : errorMessage
    }

    
    try {
        const comisionVendedor = new ComisionVendedorModel(data)
        
        const paginaInfo = await getInfoPagina(data.id_comision) 
        await comisionVendedor.save();
        
        
        return {
            data: comisionVendedor,
            pagina: paginaInfo
        } 
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en createComisionVendedor ---- data `, { data })
        LoggerInstance.error( 'Ha sucedido un error al registrar la solicitud del vendedor' , error)
        throw errorMessage;
    }
    
}


export const getSolicitudVendedorById = async (id_comision: string) => {
    try {
        const data = await ComisionVendedorModel.findOne({_id: Types.ObjectId(id_comision), estado: {$lte: 5}});
        return data
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en getComisionVendedorById ---- id_comision = ${ id_comision }`)
        LoggerInstance.error( 'Ha sucedido un error al obtener la solicitud del vendedor' , error)
        throw {
            code: 500
        }
    }
}

// ===============================

const getInfoPagina = async (id_comision: string) => {

    try {
        const query = [
            {
                $match: {
                    _id: Types.ObjectId(id_comision)
                }
            }, {
                $lookup: {
                    from: 'Paginas',
                    let: {
                        id_pagina: "$id_pagina"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$id_pagina']
                                }

                            }
                        }, {
                            $lookup: {
                                from: 'Sucursales',
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ['$id_empresa', '$$id_pagina']
                                            },
                                            principal: true,
                                            estado: 1
                                        }
                                    }, {
                                        $project: {
                                            contactos: 1,
                                            _id: 0
                                        }
                                    }
                                ],
                                as: 'Sucursal_Lookup'
                            }
                        }, {
                            $unwind: '$Sucursal_Lookup'
                        }, {
                            $project: {
                                contactos: '$Sucursal_Lookup.contactos',
                                nombre_empresa: '$empresa.nombre_empresa'
                            }
                        }
                    ],
                    as: 'Pagina_Lookup'
                }
            }, {
                $unwind: '$Pagina_Lookup'
            }, {
                $project: {
                    contactos: '$Pagina_Lookup.contactos',
                    nombre_empresa: '$Pagina_Lookup.nombre_empresa'
                }
            }
        ]

        const data = await ComisionModel.aggregate(query)

        return data;
    } catch (error) {
        LoggerInstance.info(`Ha sucedido un error en getInfoPagina ---- id_comision = ${ id_comision }`)
        LoggerInstance.error( 'Ha sucedido un error al obtener informacion de la pagina que se ha solicitado' , error)
        throw {
            code: 500
        };
    }
}


const getAllMiCatalogo = async (id_vendedor: string, queryFilter: any) => {
    
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
                estado: {
                    $lte: 2
                },
                id_vendedor: Types.ObjectId(id_vendedor)
            }
        }, {
            $lookup: {
                from: 'Comisiones',
                let: {
                    id_comision: '$id_comision'
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
                            id_pagina: 1,
                            precio: 1
                        }
                    }
                ],
                as: 'Comision_Lookup'
            }
        }, {
            $unwind: "$Comision_Lookup"
        }, {
            $project: {
                id_promocion: "$Comision_Lookup.id_promocion",
                id_pagina: "$Comision_Lookup.id_pagina",
                precio: "$Comision_Lookup.precio",

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
    const data = await ComisionVendedorModel.aggregate(pipeline)
    return data;
    } catch (error) {
        LoggerInstance.info( `Ha sucedido un error en getAllMiCatalogo  ----- id_vendedor = ${ id_vendedor } | queryFilter `, { queryFilter })
        LoggerInstance.error( 'Ha sucedido un error al mostrar las comisiones de renta cars' , error)
        throw {
            code: 500,
            message: "No se pudo mostrar todos los vehiculos"
        }
    }
}


const getMiCatalogoRentaOrDealers = async ( params: { tipo: 'Alquiler' | 'Renta' ,queryMatch: any, id_vendedor: string} ) => {

    const tipoNegocio = params.tipo == 'Alquiler' ? 'Vehiculos_rentas' : 'Vehiculos_dealers'
    const query = [
        {
            $match: {
                estado: {
                    $lte: 2
                },
                id_vendedor: Types.ObjectId(params.id_vendedor),
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
                            ...params.queryMatch

                        }
                    },
                    {
                        $project: {
                            vehiculo_indexado: 1,
                            precio_vehiculo: params.tipo == 'Alquiler' ? '$precios.precio_general' : '$precio_venta' ,
                            id_moneda: params.tipo == 'Alquiler' ? "$precios.id_moneda" : '$id_moneda',
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
        const data = await ComisionVendedorModel.aggregate(pipeline)
        return data;
    } catch (error) {
        LoggerInstance.info( `Ha sucedido un error en getMiCatalogoRentaOrDealers  ----- tipo = ${ params.tipo } | id_vendedor = ${ params.id_vendedor } | queryMatch `, { queryMatch: params.queryMatch })
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
            id_pagina: 1,
            nombre_empresa: "$Pagina_Lookup.nombre_empresa"
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