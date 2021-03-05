import express from "express"
import { verificarToken } from './components/middleware/auth.middleware'

const Chalk = require('chalk');

interface routerInterface {
    endpoint: string;
    path: string
}
const Router = express.Router();


const RoutersConfig: routerInterface[] = [
    
    // ===== User ====
    {
        endpoint: '/user',
        path: './components/usuarios/router'
    },

    // ===== Login ====
    {
        endpoint: '/login',
        path: './components/login/router'
    },
    
    // ===== Comisiones ====

    {
        endpoint: '/vehiculos',
        path: './components/comision/router'
    }, {
        endpoint: '/mi_catalogo',
        path: './components/comision/mi_catalogo/router'
    }, {
        endpoint: '/comisiones_generadas',
        path: './components/comision/comision_generadas/router'
    }

]

export default class RouterConfig {
    
    constructor(){ }



    private async setRouters() {
        try {
            for (const route of RoutersConfig) {
                const file = require(route.path)
                Router.use(route.endpoint, file)
            }
            return true
        } catch (error) {
            throw {
                message: 'No se pudo configurar todos los routes',
                cause: error
            }
                        
        }
    }



    async startRouterConfig() {
        try {
            // Router.use(verificarToken)
            await this.setRouters()
            return Router
            
        } catch (error) {
            console.log( Chalk.red(` ======== [Fatal Error]: ${error.message} ========`) );
            console.log(error.cause);
            console.log('======== End error ========');
            
            
            throw error;
        }
    }
}
