import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import colorRoutes from './routes/color-routes.js';
import wordRoutes from './routes/word-routes.js';
import insightRoutes from './routes/insight-routes.js';
// TODO: If there's time, consider adding users/login
// user table with id and pw - front end check if pw matches w database for login
// save user credentials in local storage
const app = express();
const PORT = process.env.PORT || 8080;
const HOSTNAME = process.env.HOSTNAME;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to our capstone server!');
});

app.use('/colors', colorRoutes);
app.use('/words', wordRoutes);
app.use('/insight', insightRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${HOSTNAME}:${PORT}`)
})