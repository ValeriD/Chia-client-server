import { Block } from "chia-client/dist/src/types/FullNode/Block";
import HttpException from "../exceptions/http.exception";
import Netspace from "../models/netspace.model";
import { getBlockByHeight, getBlockchainState, getBlockRecordByHeight, getBlocksInRange, getNetworkSpaceBetweenBlocks } from "./full.node.service"


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
    return await Netspace.aggregate(
        [
            {
                $group:{
                    _id: {$dateToString: { format: "%Y-%m-%d", date: "$timestamp" }},
                    max_netspace: {$max:"$current_netspace"}
                }
                
            },
            {
                $sort:{
                    _id:1
                }
            }
        ]
    ).catch(err => {throw new HttpException(500, err.message)});
}

export async function cacheNetspace(){
    const end = (await getBlockchainState()).blockchain_state.peak.height+1;
    let start = await getLastNetspaceRecord();

    let tempEnd = (end-start<100)? end : start+100;
    let lastTransactionBlock = (await getBlockByHeight(start)).block || null;

    while(tempEnd <= end){
        const blocks = (await getBlocksInRange(start,tempEnd)).blocks;
        
        for(let block of blocks){
            if(block.reward_chain_block.is_transaction_block && lastTransactionBlock.reward_chain_block.height !== block.reward_chain_block.height){
                if(await minTimePassedBetween(lastTransactionBlock, block)){
                    let netspace = 0;
                    const lastTransactionBlockHeight = block.reward_chain_block.height;
                    Promise.all([
                        netspace = (await getNetworkSpaceBetweenBlocksByHeight(lastTransactionBlockHeight, block.reward_chain_block.height)).space,
                        lastTransactionBlock = (await getBlockByHeight(block.reward_chain_block.height)).block
                    ])
                    await addNetSpace(new Date(+(block.foliage_transaction_block?.timestamp.toString() || "")*1000), netspace,lastTransactionBlock.reward_chain_block.height);
                }
            }
        }
        start = tempEnd;
        tempEnd+= (end - tempEnd<100 && end-tempEnd>0)? (end-tempEnd) : 100;
    }

}

async function getLastNetspaceRecord(){
    const last = await Netspace.findOne().sort({'timestamp':-1});

    if(!last){
        return 0;
    }else{
        return last.height;
    }
}

async function addNetSpace(time: Date, netspace: number, height:number){
    const record = {
            timestamp: time, 
            current_netspace: netspace, 
            height:height
    }
    await new Netspace(record).save()
        .catch(err => {throw new HttpException(500, err)});
}

async function getNetworkSpaceBetweenBlocksByHeight(olderBlockHeight:number, newerBlockHeight:number){
    let olderBlock = "";
    let newerBlock = "";
    await Promise.all([
        olderBlock = (await getBlockRecordByHeight(olderBlockHeight)).block_record.header_hash,
        newerBlock = (await getBlockRecordByHeight(newerBlockHeight)).block_record.header_hash
    ]);
    return await getNetworkSpaceBetweenBlocks(olderBlock, newerBlock)

}
async function minTimePassedBetween(olderBlock:Block, newerBlock:Block){
    if(!olderBlock){
        return false;
    }
    const left = +(olderBlock.foliage_transaction_block?.timestamp.toString() || ""); 
    const right =+(newerBlock.foliage_transaction_block?.timestamp.toString() || "");

    return Math.abs( (left - right) / 60) > 30;
}




