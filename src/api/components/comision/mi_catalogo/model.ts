import { Schema, model } from "mongoose";


const ComisionVendedorSchema = new Schema(
  {
    id_vendedor: { type: Schema.Types.ObjectId, ref: "Usuario_vendedor", requered: true },
    id_comision: { type: Schema.Types.ObjectId, ref: "Comision", requered: true },
    solicitud: {
        fecha_enviada: { type: Date, default: new Date() },
        fecha_aceptacion: { type: Date, required: false },
        fecha_cancelado: { type: Date, required: false },
    },
    estado: { type: Number, default: 1 },
    fecha_creado: { type: Date, default: new Date() },
    fecha_modificado: { type: Date, required: false },
    fecha_eliminado: { type: Date, required: false },
  },
  { collection: "Comisiones_vendedores" }
);

//======= Comentarios =======
//---- Estado de usuario ----
// 1 - Pendiente
// 2 - Aceptada
// 3 - Cancelada
// 5 - Eliminada

module.exports = model("Comision_vendedor", ComisionVendedorSchema)
