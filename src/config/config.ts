import dotenv from "dotenv"

dotenv.config({path:'src/env/development.env'});

const SERVER_PORT = process.env.PORT || 3000;
const SERVER_HOST = process.env.HOST || 'localhost';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'chaingreen';
const DB_USER = process.env.DB_USER || '';
const DB_PASS = process.env.DB_PASS || '';

const FULLNODE_CERTPATH = process.env.FULLNODE_CERTPATH || "";
const FULLNODE_KEYPATH = process.env.FULLNODE_KEYPATH || "";
const FULLNODE_PORT = +(process.env.FULLNODE_PORT?.toString() || "") || 8855;
const FULLNODE_HOST = process.env.FULLNODE_HOST || "localhost";
const FULLNODE_CACERTPATH = process.env.FULLNODE_CACERTPATH || "";

const Server = {
    port: SERVER_PORT,
    host: SERVER_HOST
};

const DB = {
    host: DB_HOST,
    port: DB_PORT,
    name: DB_NAME,
    user: DB_USER,
    pass: DB_PASS
}

const FULLNODE = {
    host: FULLNODE_HOST,
    port: FULLNODE_PORT,
    caCertPath: FULLNODE_CACERTPATH,
    certPath: FULLNODE_CERTPATH,
    keyPath: FULLNODE_KEYPATH
}

export { Server, DB, FULLNODE };