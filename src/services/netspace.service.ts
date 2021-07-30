import HttpException from "../exceptions/http.exception";
import Netspace, { INetspace } from "../models/netspace.model";
import { getBlockchainState } from "./full.node.service"


export async function saveCurrentNetspace(){
    const state = await getBlockchainState();

    const time = Date.now();

    const netspace = {
        timestamp: new Date(time),
        current_netspace: state.blockchain_state.space
    }

    await (new Netspace(netspace).save())
        .catch(err => {
            throw new HttpException(500, err.message)
        })
}
export async function getNetspaceRecords(){
    return await Netspace.find({}, '-_id -__v')
        .catch(err => {throw new HttpException(500, err.message)});
}


