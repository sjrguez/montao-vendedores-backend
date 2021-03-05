import { Schema, model } from "mongoose";


const ComisionGeneradaSchema = new Schema(
  {
    id_vendedor: { type: Schema.Types.ObjectId, ref: "Usuario_vendedor", requered: true },
    id_pagina: { type: Schema.Types.ObjectId, ref: "Pagina", requered: true },
    id_comision_vendedor: { type: Schema.Types.ObjectId, ref: "Comisiones_vendedores", requered: true },
    datos_cancelar: {
        descripcion: {type: String, required: false},
        fecha_cancelado: { type: Date, required: false }
    },
    info_cliente: {
        nombre: { type: String, required: true  },
        telefono: { type: String, required: true  },
        direccion: { type: String, required: true  },
        cedula: { type: String, required: true  }
    },
    detalle_precio: {
        dias: { type: Number, required: false },
        precio: { type: Number, required: true },
    },
    total_comision: { type: Number, required: true },
    estado: { type: Number, default: 1 },
    fecha_creado: { type: Date, default: new Date() },
    fecha_modificado: { type: Date, required: false },
    fecha_eliminado: { type: Date, required: false },
  },
  { collection: "Comisiones_generadas" }
);


//======= Comentarios =======
//---- Estado de usuario ----
// 1 - Pendiente
// 2 - Aceptada
// 3 - Cancelada

module.exports = model("Comision_generada", ComisionGeneradaSchema)
