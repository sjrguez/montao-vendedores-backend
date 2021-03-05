import Server from "./src/config/server";
import ServerDataBase from "./src/config/database";
import AppConfig from './src/api'



const Chalk = require('chalk');

// Instancia de la clase Server y base de datos
const ServerInstance = Server.instance
const DataBaseConection = new ServerDataBase()

const ServerApp = ServerInstance.constantes().App;
const appConfig = new AppConfig()



// ========= Initialice server =========
initialiceServer()



async function initialiceServer() {
  try {
    const app = await appConfig.initializeExpressApp()
    ServerApp.use(app)
    
    await DataBaseConection.startConection()
    
    ServerInstance.start()
  } catch (error) {

    console.log({error});
    
    console.log( Chalk.red(` ======== [Fatal Error] The server couldn't start ========`) );
    
  }
}