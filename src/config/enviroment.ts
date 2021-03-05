export const ConfigAPP = {
    SERVER_PORT: Number(process.env.PORT) || 5660,
  };
  
  export const ConfigDB = {
    MONGO_URI:
      process.env.URI_MONGO ||
      "mongodb+srv://m001-student:admin@cluster0-aobp0.mongodb.net/test2",
  };
  
  export const HOSTS_ALLOWED = {
    host1: process.env.HOST || "http://localhost:4200",
  };
  
  export const SECRETCOOKIE = process.env.SECRETCOOKIE || "$setmse$";
  export const SESSION_SECRET = process.env.SESSION_SECRET || "&asd#dd$";
  export const SEED = process.env.SEED || "$5sfsd&ffg";
  export const ExpireTimeJTW = 3.154e10;