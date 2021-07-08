import { Router } from "express"; 
import * as fullNodeController from '../controllers/full.node.controller'

const fullNode = Router();

fullNode.get('/get_blockchain_state', fullNodeController.getBlockchainState);

fullNode.get('/get_block', fullNodeController.getBlock);

fullNode.get('/get_block_record', fullNodeController.getBlockRecord);

fullNode.get('/get_unfinished_block_headers', fullNodeController.getUnfinishedBlockHeaders);

fullNode.get('/get_unspent_coins', fullNodeController.getUnspentCoins);

fullNode.get('/get_coin_record', fullNodeController.getCoinRecord);

fullNode.get('/get_additions_and_removals', fullNodeController.getAdditionsAndRemovals)

export default fullNode;