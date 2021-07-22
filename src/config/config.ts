import dotenv from "dotenv"

dotenv.config({path:'src/env/development.env'});

const SERVER_PORT = process.env.PORT || 3000;
const SERVER_HOST = process.env.HOST || 'localhost';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'chaingreen';


const Server = {
    port: SERVER_PORT,
    host: SERVER_HOST
};

const DB = {
    host: DB_HOST,
    name: DB_NAME,
}

export { Server, DB };