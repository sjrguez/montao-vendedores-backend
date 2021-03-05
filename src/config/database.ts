import { ConfigDB } from './enviroment'


const Chalk = require('chalk');
const Mongoose = require('mongoose');

Mongoose.set('useFindAndModify', false);
Mongoose.set('useUnifiedTopology', true);
Mongoose.set('useNewUrlParser', true);
Mongoose.set('useCreateIndex', true)



export default class ServerDataBase {
    private contador = 1 
    private static conectionDB = null;

    async startConection() {
        try {
            let text = '======== Connecting to Mongodb ========'

            if(this.contador > 1) text = `Error ${this.contador} intento de reconectar a mongoDB`
            console.log(Chalk.blue(text))

            ServerDataBase.conectionDB = await Mongoose.connection.openUri(`${ConfigDB.MONGO_URI}?retryWrites=true`)
            console.log(Chalk.green('======== Connected to MongoDB ========'))
            return ServerDataBase.conectionDB;
            
        } catch (error) {
            this.contador ++
            if(this.contador === 5) {
                console.log('============= Error al intentar conextar a Mongodb  ================')
                console.log( Chalk.red('[Fatal Error MongoDB]'), error)
                this.contador = 1
                throw error;
            }   
            this.startConection()
        }
    }

    async getConnectionDB() {
        if(!ServerDataBase.conectionDB) {
            throw "Por favor debe iniciar la conexion a la base de datos"
        } 
        return ServerDataBase.conectionDB;
    }
    
}