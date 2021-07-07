import { FullNode } from "chia-client";
import Logger from "jet-logger"
import { Server } from "./config/config";
import app from "./server"


app.listen(Server.port, ()=>{
    Logger.Info(`Server started on port: ` + Server.port)
})

const fullNode = new FullNode({
    protocol: 'https',
    hostname: 'localhost',
    port: 8855
});

const blockchain = async () => await fullNode.getBlockchainState().then(data => console.log(data.blockchain_state.peak.height)).catch(err => {console.error(err);});
blockchain();