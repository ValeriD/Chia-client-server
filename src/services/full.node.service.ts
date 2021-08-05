import { FullNode } from "chia-client";
import { Server } from "../config/config";
import { FullNodeConnection } from "../connections/full-node.connection";
import HttpException from "../exceptions/http.exception";

const fullNode = FullNodeConnection.getInstance().getFullNode();

export async function getBlockchainState(){
    return await fullNode.getBlockchainState()
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getBlocks(startHeight: number, endHeight: number){
    return await fullNode.getBlocks(startHeight, endHeight)
        .catch(err => {throw new HttpException(500, err.message)});

}

export async function getBlockByHash(hash:string){
    return await fullNode.getBlock(hash)
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getBlockRecordByHeight(height:number){
    return await fullNode.getBlockRecordByHeight(height)
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getBlockRecordByHash(hash:string){
    return await fullNode.getBlockRecord(hash)
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getUnfinishedBlockHeaders(height: number){
    return await fullNode.getUnfinishedBlockHeaders(height)
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getUnspentCoins(puzzleHash:string){
    return await fullNode.getUnspentCoins(puzzleHash)
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getCoinRecord(coin_info: string){
    return await fullNode.getCoinRecordByName(coin_info)
        .catch(err => {throw new HttpException(500, err.message)});

}

export async function getAdditionsAndRemovals(hash: string){
    return await fullNode.getAdditionsAndRemovals(hash)
        .catch(err => {throw new HttpException(500, err.message)});

}

export async function convertPuzzleHashToAddress(hash: string) {
    
    return await fullNode.puzzleHashToAddress(hash);
}

export async function convertAddressToPuzzleHash(address: string) {
    const hash = fullNode.addressToPuzzleHash(address)
    if(hash.length===0){
       throw new HttpException(500, "Empty hash")
    }
    return hash;
}
export async function getCoinInfo(parentCoinInfo: string, puzzleHash: string, amount: number) {

    const res =  fullNode.getCoinInfo(parentCoinInfo, puzzleHash, amount)
    if(!res || res === ''){
        throw new HttpException(500, "Connection refused");
    }
    return res;
}

export async function getBlocksInRange(start:number, end:number){
    return await fullNode.getBlocks(start, end)
        .catch(err => {throw new HttpException(500, err.message)});
}

export async function getNetworkSpaceBetweenBlocks(oldBlockHash:string, newBlockHash:string){
    return await fullNode.getNetworkSpace(newBlockHash, oldBlockHash)
        .catch(err => {throw new HttpException(500, err.message)});
}

