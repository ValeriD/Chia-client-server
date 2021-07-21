import { FullNode } from "chia-client";
import { Server } from "../config/config";
import HttpException from "../exceptions/http.exception";

const fullNode = new FullNode({
    protocol: 'https',
    hostname: Server.host,
    port: 8855
});

export async function getBlockchainState(){
    const state = await fullNode.getBlockchainState();
    return state;
}

export async function getBlocks(startHeight: number, endHeight: number){
    return await fullNode.getBlocks(startHeight, endHeight);
}

export async function getBlockByHash(hash:string){
    return await fullNode.getBlock(hash);
}

export async function getBlockRecordByHeight(height:number){
    return await fullNode.getBlockRecordByHeight(height);
}

export async function getBlockRecordByHash(hash:string){
    return await fullNode.getBlockRecord(hash);
}

export async function getUnfinishedBlockHeaders(height: number){
    return await fullNode.getUnfinishedBlockHeaders(height);
}

export async function getUnspentCoins(puzzleHash:string){
    return await fullNode.getUnspentCoins(puzzleHash);
}

export async function getCoinRecordByName(name: string){
    return await fullNode.getCoinRecordByName(name);
}

export async function getAdditionsAndRemovals(hash: string){
    return await fullNode.getAdditionsAndRemovals(hash);
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
    return await fullNode.getCoinInfo(parentCoinInfo, puzzleHash, amount);
}

