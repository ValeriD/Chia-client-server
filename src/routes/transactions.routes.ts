import { Router } from "express";
import * as transactionController from "../controllers/tranasctions.controller"

const transactionsRouter = Router();

transactionsRouter.get('/get_transactions', transactionController.getTransactions)

transactionsRouter.get('/get_transaction_info', transactionController.getTransaction);

export default transactionsRouter;