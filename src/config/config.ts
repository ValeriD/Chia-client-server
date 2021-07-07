import * as dotenv from "dotenv"

dotenv.config();

const SERVER_PORT = process.env.PORT || 3000;
const SERVER_HOST = process.env.HOST || 'localhost';

const Server = {
    port: SERVER_PORT,
    host: SERVER_HOST
};

export { Server }