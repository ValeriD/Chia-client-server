import { Router } from "express"; 

const fullNode = Router();

fullNode.get('/get_blockchain_state')

fullNode.get('/get_block');

fullNode.get('/get_block_record');

fullNode.get('/get_unfinished_block_headers');

fullNode.get('/get_unspent_coins');

fullNode.get('/get_coin_record');

fullNode.get('/get_additions_and_removals')

export default fullNode;