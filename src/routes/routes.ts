import { Router } from "express";
import { netspaceRecords } from "../controllers/netspace.controller";
import fullNode from "./full.node.routes";
import transactionsRouter from "./transactions.routes";


const router = Router();

router.use('',fullNode);
router.use('', transactionsRouter)

router.get('/get_netspace_records', netspaceRecords);

export default router;

