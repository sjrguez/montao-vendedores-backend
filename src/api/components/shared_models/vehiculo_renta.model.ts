import { Schema, model } from "mongoose";


var vehiculoRentaSchema = new Schema({

    id_vehiculo: { type: Schema.Types.ObjectId, ref: 'Vehiculo', required: true },
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario_plataforma', required: true },
    id_pagina: { type: Schema.Types.ObjectId, ref: 'Pagina', required: true },
    vehiculo_indexado: {
        plaza: { type: Number, required: true },
        marca: {
            id_marca: { type: Schema.Types.ObjectId, ref: 'Marcas', required: true },
            nombre: { type: String, required: true }
        },
        modelo: {
            id_modelo: { type: Schema.Types.ObjectId, ref: 'Modelos', required: true },
            nombre: { type: String, required: true }
        },
        year: { type: String, required: true },
        transmision: { type: String, default: 'No disponible' },
        tipo_vehiculo: { type: String, required: true },
        provincias: [{
            id_sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal', required: true },
            nombre: { type: String, required: true }
        }],
    },
    visitas: {
        comunes_visita_total: { type: Number, required: true, default: 0 },
        registrados_visita_total: { type: Number, required: true, default: 0 },
    },
    desactivado_pagina: { type: Boolean, default: false },
    desactivado_vehiculo: { type: Boolean, default: false },
    precios: {
        precio_general: { type: Number, required: true },
        id_moneda: { type: Schema.Types.ObjectId, ref: 'Moneda', required: true },
        precio_multiple: [
            {
                días: { type: Number, required: false },
                precio: { type: Number, required: false },
                estado: { type: Boolean, required: false }
            }
        ]
    },
    precio_oferta: { type: Number, required: false },
    posicion: { type: Number, required: true },
    estado: { type: Number, default: 1, required: true },
    oferta: { type: Boolean, default: false },
    estadoAdmin: { type: Number, default: 0 },
    fecha_registro: { type: Date, required: false, default: new Date() },
    fecha_modificacion: { type: Date, required: false },
    fecha_eliminacion: { type: Date, required: false },
    descripcion: { type: String, required: false }
}, { collection: "Vehiculos_rentas" })

//======= Comentarios =======
//---- Estado de usuario ----
// 1 - Activo
// 2 - Pendiente
// 3 - Desactivo
// 5 - Eliminado por el usuario
// desactivado_vehiculo == true -  se ha desactivado el vehiculo en mi garaje  
// desactivado_pagina == true - Se ha desactivado al desactivar la pagina 

//---- Estado de administracion ----
// 2 - Eliminado por la administracion

module.exports = model("Vehiculo_renta", vehiculoRentaSchema)
