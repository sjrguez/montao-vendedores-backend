import { Schema, model } from "mongoose";

//import uniqueValidator from "mongoose-unique-validator";



var usuarioSchema = new Schema({
    tipo_empresa: { type: Boolean, default: false },
    id_pais: { type: Schema.Types.ObjectId, ref: 'Pais', required: false },
    usuario: { type: String, required: false },//Unico
    nombre_completo: { type: String, required: [true, "Nombre es requerido"] },
    correo: { type: String, required: true },//Unico
    correo_valido: { type: Boolean, required: false, default: false },  // Si el correo es de google, asignar true
    cedula_valido: { type: Boolean, required: false, default: false },
    telefono_valido: { type: Boolean, required: false, default: false },
    plan: { type: Boolean, required: false, default: false },
    password: { type: String, required: false },
    cedula: { type: String, required: false },//Unico
    telefono: { type: String, required: false },
    id_prefijo_telefono: { type: Schema.Types.ObjectId, ref: 'Pais', required: false },
    direccion: { type: String, required: false },
    fecha_nacimiento: { type: Date, required: false },
    sexo: { type: String, required: false },
    google: { type: Boolean, required: false, default: false },
    facebook: { type: Boolean, required: false, default: false },
    licencia: { type: String, required: false },
    estado: { type: Number, required: false, default: 1 },
    estadoAdmin: { type: Number, default: 0 },
    fecha_registro: { type: Date, required: false, default: new Date() },
    fecha_modificacion: { type: Date, required: false },
    fecha_eliminacion: { type: Date, required: false },
    membresia: {

        id_membresia: { type: Schema.Types.ObjectId, ref: 'Membresia', required: [true, "La membresia es requerida"] },
        privilegios_plataforma: [
            {
                id_privilegio_plataforma: { type: Schema.Types.ObjectId, ref: "Privilegios_plataforma" },
                id_funciones_plataforma: { type: Schema.Types.ObjectId, ref: "Funcione_privilegio_plataforma" },
            }
        ]

    },

}, { collection: "Usuarios_plataforma" })



//======= Comentarios =======

//---- Estado  ----
// 1 - Activo
// 2 - Desactivo
// 3 - Eliminado


//---- Estado Admin ----
// 1 - Desactivo por la administracion
// 2 - Eliminado por la administracion


module.exports = model("Usuario_plataforma", usuarioSchema)
