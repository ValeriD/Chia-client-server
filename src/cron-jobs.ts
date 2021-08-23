import { CronJob } from "cron";
import Logger from "jet-logger";
import { cacheNetspace, saveCurrentNetspace } from "./services/netspace.service";
import { checkForNewTransactions } from "./services/transactions.caching.service";


const startTransactionsCachingJob = () => {
    new CronJob('0 * * * * *', async () => {
        Logger.Info("Transaction caching job started");
        await checkForNewTransactions()
            .catch(err => Logger.Err(err.message));
        Logger.Info("Transaction caching job finished");
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