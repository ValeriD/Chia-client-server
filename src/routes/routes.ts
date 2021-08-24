import { Router } from "express";
import addressRouter from "./addresses.routes";
import fullNode from "./full.node.routes";
import transactionsRouter from "./transactions.routes";


const router = Router();

router.use('',fullNode);
router.use('', transactionsRouter)
router.use('', addressRouter);

export default router;

