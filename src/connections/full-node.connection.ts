import { FullNode } from "chia-client";
import Logger from "jet-logger";
import { FULLNODE } from "../config/config";


export class FullNodeConnection{
    private static _instance: FullNodeConnection;
    private fullNode: FullNode;

    private constructor(){
        this.fullNode = new FullNode({
            protocol: 'http',
            hostname: FULLNODE.host,
            port: FULLNODE.port,
            certPath:FULLNODE.certPath,
            keyPath:FULLNODE.keyPath
        });
    }

    public static getInstance(){
        return this._instance  || (this._instance = new this());
    }

    public getFullNode() : FullNode{
        return this.fullNode;
    }
}