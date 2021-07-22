import Logger from "jet-logger";
import HttpException from "../exceptions/http.exception";
import Transaction, { ITransaction } from "../models/transaction.model";
import * as fullNodeService from "./full.node.service"

async function addTransaction(coinBlock:any){
    const transaction = await serializeTransaction(coinBlock);
    await transaction.save()
        .catch(err => {throw new HttpException(500, err.message)});
}

async function serializeTransaction(coinBlock:any):Promise<ITransaction>{
    const transaction={
        coin_info: await fullNodeService.getCoinInfo(coinBlock.coin.parent_coin_info, coinBlock.coin.puzzle_hash, coinBlock.coin.amount),
        amount:parseInt(coinBlock.coin.amount),
        creation_height: parseInt(coinBlock.confirmed_block_index),
        owner_puzzle_hash: coinBlock.coin.puzzle_hash,
        owner_address: (await fullNodeService.convertPuzzleHashToAddress(coinBlock.coin.puzzle_hash)),
        parent_coin: coinBlock.coin.parent_coin_info,
        source: (coinBlock.coinbase)? "Coinbase" : "",
        creation_time: new Date(coinBlock.timestamp*1000)
    } 
    return new Transaction(transaction);;
}

async function getLastRecordHeight(){
    const lastTransaction:ITransaction | null = await Transaction.findOne().sort('-creationHeight');

    if(!lastTransaction){
        return -1;
    }else{
        return lastTransaction.creation_height;
    }
}
/**
 * Retrieving the blocks from the last cached and then checking which one has transactions
 * Then is called the addNewTransaction with the block hash that gets all additions and saves them in the database
 */
export async function checkForNewTransactions(){
    const end = (await fullNodeService.getBlockchainState()).blockchain_state.peak.height;
    let start = await getLastRecordHeight()+1;

    let tempEnd = (end<100)? end : start+100;

    //To work with smaller payload process all blocks 100 at a time
    while(tempEnd<=end){
        const blocks = (await fullNodeService.getBlocksInRange(start,tempEnd)).blocks;

        for(let block of blocks){
            if(block.reward_chain_block.is_transaction_block){
                await addNewTransaction(block.header_hash)
            }
        }
        start = tempEnd+1;  
        tempEnd+=100;
    }
}

async function addNewTransaction(hash:any){
    const additions = (await fullNodeService.getAdditionsAndRemovals(hash)).additions

    for(let addition of additions){
        await addTransaction(addition);
    }
}