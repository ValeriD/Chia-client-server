import { CronJob } from "cron";
import Logger from "jet-logger";
import { cacheNetspace } from "./services/netspace.service";
import { checkForNewTransactions } from "./services/transactions.caching.service";

let isTransactionsJobRunning = false;
const startTransactionsCachingJob = () => {
    new CronJob('0 * * * * *', async () => {
        if(!isTransactionsJobRunning){
            isTransactionsJobRunning = true;
            Logger.Info("Transaction caching job started");
            await checkForNewTransactions()
                .catch(err => Logger.Err(err.message));
            Logger.Info("Transaction caching job finished");
            isTransactionsJobRunning = false;
        }
    }).start();
}

const startNetspaceJob = () => {
    new CronJob('20 * * * *', async () => {
        Logger.Info("Netspace job started");

        await cacheNetspace()
            .catch(err => Logger.Err(err.message));

        Logger.Info("Netspace job finished");
    }).start()
}

const startCronJobs = () => {
    startTransactionsCachingJob();
    startNetspaceJob();
}

export { startCronJobs }