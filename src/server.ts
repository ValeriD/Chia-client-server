import express from 'express';
import routes from './routes/routes';
import cors from 'cors'
const app = express();


////////////////////////////////////////////////////////////////
// Server configuration
////////////////////////////////////////////////////////////////
app.use(cors())
app.use(express.json());
app.use(routes);

export default app;