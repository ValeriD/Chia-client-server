import { FullNodeConnection } from "../connections/full-node.connection";
import HttpException from "../exceptions/http.exception";
import { getAddress, getCirculatingSupply, getUniqueAddressCount } from "./address.service";
import { getTransaction, getTransactionsByCreationHeight } from "./transactions.service";

const fullNode = FullNodeConnection.getInstance().getFullNode();

export async function getBlockchainState(){
    const blockchain:any = await fullNode.getBlockchainState()
        .catch(err => {throw new HttpException(500, err.message)});

    if(!blockchain.success){
        throw new HttpException(500, blockchain.error || "");
    }
    blockchain.blockchain_state.circulating_supply = (await getCirculatingSupply()).values().next().value?.circulating_supply || 0;
    blockchain.blockchain_state.unique_address_count = await getUniqueAddressCount();

    return blockchain;
}

export async function getBlocks(startHeight: number, endHeight: number){
    const blocks = await fullNode.getBlocks(startHeight, endHeight)
        .catch(err => {throw new HttpException(500, err.message)});


    if(!blocks.success){
        throw new HttpException(404, blocks.error || "");
    }
    return blocks;
}

export async function getBlockByHash(hash:string){

    const block = await fullNode.getBlock(hash)
        .catch(err => {throw new HttpException(500, err.message)});
    if(!block.success){
        throw new HttpException(404, block.error || "");
    }

    if(block.block.reward_chain_block.is_transaction_block){
        (block.block.transactions_info as any).amount = await calculateTransactionBlockAmount(hash);
        (block.block.transactions_info as any).transactions = await getTransactionsByCreationHeight(+block.block.reward_chain_block.height);
    }
    return block
}

export async function getBlockByHeight(height:number){
    const res = await fullNode.getBlockRecordByHeight(height)
        .catch(err => {throw new HttpException(500, err.message)});

    if(!res.success){
        throw new HttpException(404, res.error || "");
    }

    const hash = res.block_record.header_hash;
    
    const record = await getBlockByHash(hash);

    if(!record.success){
        throw new HttpException(500, record.error || "");
    }
    return record;
}

export async function getBlockRecordByHeight(height:number){
    const blockRecord = await fullNode.getBlockRecordByHeight(height)
        .catch(err => {throw new HttpException(500, err.message)});

    if(!blockRecord.success){
        throw new HttpException(404, blockRecord.error || "");
    }
    return blockRecord;
}

export async function getBlockRecordByHash(hash:string){
    const blockRecord = await fullNode.getBlockRecord(hash)
        .catch(err => {throw new HttpException(500, err.message)});
    if(!blockRecord.success){
        throw new HttpException(404, blockRecord.error || "");
    }
    return blockRecord;
}

export async function getUnfinishedBlockHeaders(height: number){
    const unfinishedBlocks = await fullNode.getUnfinishedBlockHeaders(height)
        .catch(err => {throw new HttpException(500, err.message)});
    
    if(!unfinishedBlocks.success){
        throw new HttpException(404, unfinishedBlocks.error || "");
    }
    return unfinishedBlocks;
}

export async function getUnspentCoins(puzzleHash:string){
    const unspentCoins = await fullNode.getUnspentCoins(puzzleHash)
        .catch(err => {throw new HttpException(500, err.message)});
    if(!unspentCoins.success){
        throw new HttpException(404, unspentCoins.error || "");
    }
    return unspentCoins;
}

export async function getCoinRecord(coin_info: string){
    const coinRecord = await fullNode.getCoinRecordByName(coin_info)
        .catch(err => {throw new HttpException(500, err.message)});
    if(!coinRecord.success){
        throw new HttpException(404, coinRecord.error || "");
    }
    return coinRecord;
}

export async function getAdditionsAndRemovals(hash: string){
    const additionsAndRemovals = await fullNode.getAdditionsAndRemovals(hash)
        .catch(err => {throw new HttpException(500, err.message)});
    if(! additionsAndRemovals.success){
        throw new HttpException(404, additionsAndRemovals.error || "");
    }
    return additionsAndRemovals;
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
    const netspace = await fullNode.getNetworkSpace(newBlockHash, oldBlockHash)
        .catch(err => {throw new HttpException(500, err.message)});
    if(!netspace.success){
        throw new HttpException(400, netspace.success || "");
    }
    return netspace;
}

export async function find(searchId: any){
    
    if(searchId.toString().substring(0,3)==="cgn"){
        return {address:await getAddress(searchId.toString())};
    }else if(searchId.toString().substring(0,2)==="0x"){
        let searchBlock = false;
        const transaction = await getTransaction(searchId.toString())
            .catch(err => {
                if(err.status === 404){
                    searchBlock = true;
                }
            });
        if(!searchBlock){
            return { transaction:transaction};
        }else{
            return await getBlockByHash(searchId.toString());
        }
    }else{
        return await getBlockByHeight(+(searchId.toString() || ""));
    }
}

async function calculateTransactionBlockAmount(hash:string){
    const additionsAndRemovals = await getAdditionsAndRemovals(hash);
    let amount = 0;
    for(const addition of additionsAndRemovals.additions){
        amount += +(addition.coin.amount);
    }

    for(const removal of additionsAndRemovals.removals){
        amount-= +(removal.coin.amount);
    }

    return amount;    
}

