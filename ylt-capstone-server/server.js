import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import colorRoutes from './routes/color-routes.js';

const app = express();
const PORT = process.env.PORT || 8080;
const HOSTNAME = process.env.HOSTNAME;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to our capstone server!');
});

app.use('/colors', colorRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${HOSTNAME}:${PORT}`)
})