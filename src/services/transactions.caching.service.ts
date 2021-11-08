import { CoinRecord } from "chia-client/dist/src/types/FullNode/CoinRecord";
import Logger from "jet-logger";
import HttpException from "../exceptions/http.exception";
import Transaction, { ITransaction } from "../models/transaction.model";
import { addAddress } from "./address.service";
import * as fullNodeService from "./full.node.service"

/**
 * Retrieving the blocks from the last cached and then checking which one has transactions
 * Then is called the addNewTransaction with the block hash that gets all additions and saves them in the database
 */
export async function checkForNewTransactions(){
    let revert = false
    const end = (await fullNodeService.getBlockchainState()).blockchain_state.peak.height +1;
    let start = await getLastRecordHeight()+1;

    let tempEnd = (end-start<100)? end : start+100;

    //To work with smaller payload process all blocks 100 at a time
    while(tempEnd <= end){
        const blocks = (await fullNodeService.getBlocksInRange(start,tempEnd)).blocks;

        revert = false;

        for(let block of blocks){

            if(revert) break; //Breaking the addition of new transactions if revert is needed

            if(block.reward_chain_block.is_transaction_block){
                await fullNodeService.getAdditionsAndRemovals(block.header_hash || "")
                    .then(async (transactions) => {
                        if(transactions.success && !transactions.error){
                            await addAdditionTransactions(transactions.additions)
                                .catch(err => {Logger.Err(err.message)});
                        }
                    })
                    .catch(async(err) => {
                        if(err.message.includes("is no longer in the blockchain")){
                            //Reverting 10 blocks
                            start -= 10;
                            revert = true;
                            await removeTransactionsAfterHeight(start);
                            
                        }else{
                            throw new HttpException(500, err.message);
                        }
                    });
                
            }
        }
        
        if(revert)continue; //Preventing from changing the start if revert is needed

        start = tempEnd; 
         
        tempEnd+= (end - tempEnd<100 && end-tempEnd>0)? (end-tempEnd) : 100;
    }
}

async function removeTransactionsAfterHeight(height: number){
    const transactions = await Transaction.find()
                                            .where("confirmation_block")
                                            .gte(height)
    for(let transaction of transactions){
        await transaction.remove()
    }
}

async function getLastRecordHeight(){
    const lastTransaction:ITransaction | null = await Transaction.findOne().sort({'confirmation_block':-1});

    if(!lastTransaction){
        return 0;
    }else{
        return lastTransaction.confirmation_block;
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

async function addTransaction(coinBlock: CoinRecord){
    const transaction = await serializeTransaction(coinBlock);
     await transaction.save()
         .catch(err => {throw new HttpException(500, err.message)});
}

async function serializeTransaction(coinBlock:CoinRecord): Promise<ITransaction>{
    const coin = coinBlock.coin;
    //Retrieving the parent coin info so that we can get the sender
    let parent_coin : CoinRecord = {} as CoinRecord;
    await fullNodeService.getCoinRecord(coin.parent_coin_info)
        .then(data => {
            if(data.success){
                parent_coin = data.coin_record;
            }
        })
        .catch(err => {});

    //Serializeing the transaction
    const transaction={
        transaction_id: await fullNodeService.getCoinInfo(coin.parent_coin_info.toString(), coin.puzzle_hash.toString(), +coin.amount),
        created_at: new Date(+coinBlock.timestamp*1000),
        amount: +coin.amount,
        confirmation_block: +coinBlock.confirmed_block_index,
        confirmations_number: await getConfirmationNumber(parent_coin, coinBlock),
        sender:(parent_coin.coin)? await fullNodeService.convertPuzzleHashToAddress(parent_coin.coin.puzzle_hash): " ",
        receiver:await fullNodeService.convertPuzzleHashToAddress(coin.puzzle_hash),
        input: parent_coin.coin
    }

    //Add address if not added yet
    await addAddress(transaction.receiver);

    return new Transaction(transaction);
}

async function getConfirmationNumber(parent_coin:CoinRecord | undefined, coin:CoinRecord){
   if(!parent_coin?.coin){
       return 0;
   }else{
       return coin.confirmed_block_index - parent_coin.confirmed_block_index;
   }
}