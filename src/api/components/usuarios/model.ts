import { Schema, model } from "mongoose";

//import uniqueValidator from "mongoose-unique-validator";



var usuarioSchema = new Schema({
    id_pais: { type: Schema.Types.ObjectId, ref: 'Pais', required: false },
    nombre_completo: { type: String, required: [true, "Nombre es requerido"] },
    correo: { type: String, required: true, lowerCase: true, trim: true },//Unico
    password: { type: String, required: true },
    cedula: { type: String, required: false },//Unico
    telefono: { type: String, required: false },
    id_prefijo_telefono: { type: Schema.Types.ObjectId, ref: 'Pais', required: false },
    direccion: { type: String, required: false },
    fecha_nacimiento: { type: Date, required: false },
    sexo: { type: String, required: false },
    google: { type: Boolean, required: false, default: false },
    licencia: { type: String, required: false },
    estado: { type: Number, required: false, default: 1 },
    estadoAdmin: { type: Number, default: 0 },
    fecha_registro: { type: Date, required: false, default: new Date() },
    fecha_modificacion: { type: Date, required: false },
    fecha_eliminacion: { type: Date, required: false },

}, { collection: "Usuarios_vendedores" })



//======= Comentarios =======

//---- Estado  ----
// 1 - Activo
// 2 - Desactivo
// 4 - Eliminado


//---- Estado Admin ----
// 1 - Desactivo por la administracion
// 2 - Eliminado por la administracion

module.exports = model('Usuario_vendedor', usuarioSchema)
