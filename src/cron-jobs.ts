import { CronJob } from "cron";
import Logger from "jet-logger";
import { checkForNewTransactions } from "./services/transactions.caching.service";


const startCachingJob = () => {
    new CronJob('0 1 * * * *', async () => {
        Logger.Info("Cronjob started");
        await checkForNewTransactions()
            .catch(err => Logger.Err(err.message));
        Logger.Info("Cronjob finished");
    }).start();
}

export { startCachingJob }