import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import colorRoutes from './routes/color-routes.js';
import wordRoutes from './routes/word-routes.js';
import insightRoutes from './routes/insight-routes.js';
import themeRoutes from './routes/theme-routes.js';

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
app.use('/theme', themeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${HOSTNAME}:${PORT}`)
})