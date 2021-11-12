import express from 'express';
import routes from './routes/routes';
import cors from 'cors'
import { trim } from './middlewares/trim.middleware';
const app = express();


////////////////////////////////////////////////////////////////
// Server configuration
////////////////////////////////////////////////////////////////
app.use(cors())
app.use(express.json());
app.use(trim)

app.use(routes);

export default app;