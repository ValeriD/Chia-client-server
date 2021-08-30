import { Router } from "express"; 
import * as fullNodeController from '../controllers/full.node.controller'
import { netspaceRecords } from '../controllers/netspace.controller'
const fullNode = Router();



fullNode.get('/get_blockchain_state', fullNodeController.getBlockchainState);

fullNode.get('/get_block', fullNodeController.getBlock);

fullNode.get('/get_blocks', fullNodeController.getBlocks);

fullNode.get('/get_block_record', fullNodeController.getBlockRecord);

fullNode.get('/get_unfinished_block_headers', fullNodeController.getUnfinishedBlockHeaders);

fullNode.get('/get_unspent_coins', fullNodeController.getUnspentCoins);

fullNode.get('/get_coin_record', fullNodeController.getCoinRecord);

fullNode.get('/get_additions_and_removals', fullNodeController.getAdditionsAndRemovals)

fullNode.get('/get_coin_info', fullNodeController.getCoinInfo);

fullNode.get('/puzzleHash_to_address', fullNodeController.puzzleHashToAddress);

fullNode.get('/address_to_puzzleHash', fullNodeController.addressToPuzzleHash);

fullNode.get('/get_nespace_per_day',netspaceRecords);

fullNode.get('/search', fullNodeController.search);

export default fullNode;