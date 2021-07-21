import { Router } from "express"; 
import * as fullNodeController from '../controllers/full.node.controller'

const fullNode = Router();



fullNode.get('/get_blockchain_state', fullNodeController.getBlockchainState);

/**
 * @requiredParamInTheRequest block's hash
 */
fullNode.get('/get_block', fullNodeController.getBlock);

/**
 * @requiredParamInTheRequest startHeight
 * @requiredParamInTheRequest endHeight
 */
fullNode.get('/get_blocks', fullNodeController.getBlocks);

/**
 * @requiredParamInTheRequest hash or height
 */
fullNode.get('/get_block_record', fullNodeController.getBlockRecord);

/**
 * @requiredParamInTheRequest height
 */
fullNode.get('/get_unfinished_block_headers', fullNodeController.getUnfinishedBlockHeaders);

/**
 * @requiredParamInTheRequest puzzleHash
 */
fullNode.get('/get_unspent_coins', fullNodeController.getUnspentCoins);

/**
 * @requiredParamInTheRequest name
 */
fullNode.get('/get_coin_record', fullNodeController.getCoinRecord);

/**
 * @requiredParamInTheRequest hash
 */
fullNode.get('/get_additions_and_removals', fullNodeController.getAdditionsAndRemovals)

fullNode.get('/get_coin_info', fullNodeController.getCoinInfo);

fullNode.get('/puzzleHash_to_address', fullNodeController.puzzleHashToAddress);

fullNode.get('/address_to_puzzleHash', fullNodeController.addressToPuzzleHash);

export default fullNode;