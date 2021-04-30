import { Schema, model } from "mongoose";

const PaisesSchema = new Schema({

    nombre: { type: String, required: true },
    prefijo_telefono: { type: String, required: true },
    fecha_registro: { type: Date, default: new Date() },
    fecha_modificacion: { type: Date, required: false },
    estado: { type: Boolean, default: true }
}, { collection: 'Paises' })

module.exports = model("Pais", PaisesSchema)