import * as log4js from "log4js";
   
   
const isDevEnvironment = !process.env.PORT ? true : false 


export default class Logger {
    private logger: log4js.Logger
    
    constructor(workingOn: string   ) {
      // log4js.configure({
      //   appenders: { cheese: { type: "file", filename: "cheese.log" } },
      //   categories: { default: { appenders: ["cheese"], level: "error" } }
      // });
      
      this.logger = log4js.getLogger(` { Lugar: ${workingOn} }`);
      this.logger.level =  isDevEnvironment ? "debug" : "error";

    }
    
    debug(msg: any, meta: any = '') {
      
      this.logger.debug(msg, meta);
    }
    
    info(msg: any, meta: any = '') {
      this.logger.info(msg, meta);
    }
    
    warn(msg: any, meta: any = '') {
      this.logger.warn(msg, meta);
    }
    
    error(msg: any, meta: any = '') {
      this.logger.error(msg, meta);
    }
    
    fatal(msg: any, meta: any = '') {
      this.logger.log('fatal', msg, meta);
    }
  }
   
    