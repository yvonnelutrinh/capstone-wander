import { Router } from 'express';
import axios from "axios";
const router = Router();

router.get("/", async (_req, res) => {
    try {
        const response = await axios.get(`https://random-word-api.vercel.app/api?words=2
    `); 
        res.json(response.data).status(200);
    }
    catch (err) {
        res.status(500).send(`Error retrieving words: ${err}`);
    }
})

export default router;