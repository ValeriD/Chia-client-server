import { CronJob } from "cron";
import Logger from "jet-logger";
import { saveCurrentNetspace } from "./services/netspace.service";
import { checkForNewTransactions } from "./services/transactions.caching.service";


const startTransactionsCachingJob = () => {
    new CronJob('1 * * * * *', async () => {
        Logger.Info("Transaction caching job started");
        await checkForNewTransactions()
            .catch(err => Logger.Err(err.message));
        Logger.Info("Transaction caching job finished");
    }).start();
}

const startNetspaceJob = () => {
    new CronJob('41 * * * *', async () => {
        Logger.Info("Netspace job started");

        await saveCurrentNetspace()
            .catch(err => Logger.Err(err.message));

        Logger.Info("Netspace job finished");
    }).start()
}

const startCronJobs = () => {
    startTransactionsCachingJob();
    startNetspaceJob();
}

export { startCronJobs }