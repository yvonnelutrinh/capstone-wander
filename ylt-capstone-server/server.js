import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

app.get('/', (req, res) => {
    res.send('Welcome to our capstone server!');
});

app.listen(8080, () => {
    console.log(`Server is running on ${HOSTNAME}:${PORT}`)
})