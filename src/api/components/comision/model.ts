import { Schema, model } from "mongoose";

const collections_allowed = {
    values:  ['Vehiculos_rentas', 'Vehiculos_dealers'],
    message: 'Coleccion no permitida'
}

const ComisionSchema = new Schema(
  {
    id_pagina: { type: Schema.Types.ObjectId, ref: "Pagina", requered: true },
    id_promocion: {type: Schema.Types.ObjectId, refPath: 'onModel'  },
    onModel: { type: String, required: true, enum: collections_allowed },
    precio: {type: Number,required: true },
    estado: { type: Number, default: 1 },
    fecha_creado: { type: Date, default: new Date() },
    fecha_modificado: { type: Date, required: false },
    fecha_eliminado: { type: Date, required: false },
  },
  { collection: "Comisiones" }
);

module.exports = model("Comision", ComisionSchema)
