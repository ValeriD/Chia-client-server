import { Router } from "express";
import fullNode from "./full.node.routes";
import transactionsRouter from "./transactions.routes";


const router = Router();

router.use('',fullNode);
router.use('', transactionsRouter)

export default router;

