import { CoinRecord } from "chia-client/dist/src/types/FullNode/CoinRecord";
import Logger from "jet-logger";
import HttpException from "../exceptions/http.exception";
import Transaction, { ITransaction } from "../models/transaction.model";
import * as fullNodeService from "./full.node.service"

async function addTransaction(coinBlock: CoinRecord){
    const transaction = await serializeTransaction(coinBlock);
    await transaction.save()
        .catch(err => {throw new HttpException(500, err.message)});
}

async function serializeTransaction(coinBlock:CoinRecord):Promise<ITransaction>{

    const transaction={
        coin_info: await fullNodeService.getCoinInfo(coinBlock.coin.parent_coin_info, coinBlock.coin.puzzle_hash, +coinBlock.coin.amount),
        amount:parseInt(coinBlock.coin.amount),
        creation_height: +coinBlock.confirmed_block_index,
        owner_puzzle_hash: coinBlock.coin.puzzle_hash,
        owner_address: (await fullNodeService.convertPuzzleHashToAddress(coinBlock.coin.puzzle_hash)),
        parent_coin: coinBlock.coin.parent_coin_info,
        source: (coinBlock.coinbase)? "Coinbase" : "",
        creation_time: new Date((+coinBlock.timestamp) *1000)
    } 
    return new Transaction(transaction);;
}

async function getLastRecordHeight(){
    const lastTransaction:ITransaction | null = await Transaction.findOne().sort({'creation_height':-1});

    if(!lastTransaction){
        return 0;
    }else{
        return lastTransaction.creation_height;
    }
}

async function addAdditionTransactions(additions:CoinRecord []){
    if(!additions){
        throw new HttpException(500, "Additions not found");
    }
    for(let addition of additions){
        await addTransaction(addition);
    }
}

async function addRemovalsTransactions(removals:CoinRecord []){
    if(!removals){
        throw new HttpException(500, "Removals not found");
    }
    for(let removal of removals){
        await addTransaction(removal);
    }

}

/**
 * Retrieving the blocks from the last cached and then checking which one has transactions
 * Then is called the addNewTransaction with the block hash that gets all additions and saves them in the database
 */
export async function checkForNewTransactions(){
    const end = (await fullNodeService.getBlockchainState()).blockchain_state.peak.height +1;
    let start = await getLastRecordHeight();

    let tempEnd = (end-start<100)? end : start+100;

    //To work with smaller payload process all blocks 100 at a time
    while(tempEnd <= end){
        const blocks = (await fullNodeService.getBlocksInRange(start,tempEnd)).blocks;
        
        for(let block of blocks){
            if(block.reward_chain_block.is_transaction_block){
                const transactions = await fullNodeService.getAdditionsAndRemovals(block.header_hash || "");
                if(transactions.success){
                    await addAdditionTransactions(transactions.additions)
                        .catch(err => {Logger.Err(err.message)});
                    await addRemovalsTransactions(transactions.removals)
                        .catch(err => {Logger.Err(err.message)});
                }
            }
        }
        start = tempEnd; 
         
        tempEnd+= (end - tempEnd<100 && end-tempEnd>0)? (end-tempEnd) : 100;
    }
}