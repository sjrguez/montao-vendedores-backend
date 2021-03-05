import express from "express"
import { ConfigAPP }  from './enviroment';

const Chalk = require('chalk')
export default class Server {
    public static _intance:Server
    
    private App: express.Application
    private Port: Number


   private constructor(){
        this.App = express()
        this.Port = ConfigAPP.SERVER_PORT
    }

    public static get instance(){
        return this._intance || (this._intance = new this())
    }

    public constantes (){
        return {
                  App:this.App,
                  Port:this.Port,
                }
    }


    start(){
        this.App.listen(this.Port, () => {
            console.log(Chalk.green('Server running on port: '), this.Port)
        })
    }
}