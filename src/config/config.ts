import dotenv from "dotenv"

dotenv.config({path:'src/env/development.env'});

const SERVER_PORT = process.env.PORT || 3000;
const SERVER_HOST = process.env.HOST || 'localhost';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'chaingreen';

const FULLNODE_CERTPATH = process.env.FULLNODE_CERTPATH || "";
const FULLNODE_KEYPATH = process.env.FULLNODE_KEYPATH || "";
const FULLNODE_PORT = +(process.env.FULLNODE_PORT?.toString() || "") || 8855;
const FULLNODE_HOST = process.env.FULLNODE_HOST || "localhost";


const Server = {
    port: SERVER_PORT,
    host: SERVER_HOST
};

const DB = {
    host: DB_HOST,
    name: DB_NAME,
}

const FULLNODE = {
    host: FULLNODE_HOST,
    port: FULLNODE_PORT,
    certPath: FULLNODE_CERTPATH,
    keyPath: FULLNODE_KEYPATH
}

export { Server, DB, FULLNODE };