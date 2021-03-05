import {
  HOSTS_ALLOWED,
  SECRETCOOKIE,
  SESSION_SECRET,
} from "../config/enviroment";
import express from "express";
import RouterConfig from "./router";

// Constantes

const Cors = require("cors");
const Helmet = require("helmet");
const BodyParser = require("body-parser");
const cookieSession = require("cookie-parser");
const session = require("express-session");
const compression = require("compression");
const chakl = require("chalk");

export default class AppConfig {
  private App: express.Application;

  constructor() {
    this.App = express();
  }

  private setCorsConfig() {
    // ======= Cors's  =======
    const Permitidos = Object.entries(HOSTS_ALLOWED)[1];

    this.App.use(
      Cors({
        origin: function (origin: any, callback: any) {
          //  if(!origin) return callback(null, true);
          // if(Permitidos.indexOf(origin) === -1){
          //   var msg = 'Acceso no permitido.';
          //   return callback(msg, false);
          // }
          return callback(null, true);
        },
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );
  }

  private setAppCompressionConfig() {
    this.App.use(compression({ filter: shouldCompress }));

    function shouldCompress(req: any, res: Response) {
      if (req.headers["x-no-compression"]) {
        // No le responde a las peticion con este header
        return false;
      }
      return compression.filter(req, res);
    }
  }

  private setBodyParseConfig() {
    this.App.use(BodyParser.urlencoded({ limit: "17mb", extended: true }));
    this.App.use(BodyParser.json({ limit: "17mb", extended: true }));
  }

  private setHelmetConfig() {
    this.App.use(Helmet());
    this.App.use(Helmet.hidePoweredBy({ setTo: "StupidThings 1.0" }));
  }

  private async setRouters() {
    try {
      const routerConfig = new RouterConfig();
      const routers = await routerConfig.startRouterConfig();

      this.App.use("/api", routers);

      return true;
    } catch (error) {
      throw error;
    }
  }

  private setCookieConfig() {
    // ======= Configuracion de la cookie y session =======

    this.App.use(cookieSession(SECRETCOOKIE));
    this.App.use(
      session({
        secret: SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
      })
    );
  }

  public async initializeExpressApp() {
    try {
      this.setAppCompressionConfig();
      this.setBodyParseConfig();
      this.setCorsConfig();
      this.setHelmetConfig();
      this.setCookieConfig();

      await this.setRouters();

      console.log(
        chakl.blue(
          "======== All express's configurations has been established ========"
        )
      );

      return this.App;
    } catch (error) {
      throw error;
    }
  }
}
