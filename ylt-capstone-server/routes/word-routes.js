import { Router } from 'express';
import axios from "axios";
const router = Router();

router.get("/", async (_req, res) => {
    try {
        const response = await axios.get(`https://random-word-api.vercel.app/api?words=2
    `); //TODO: Try different api to choose word type
    // Related words? https://www.wordsapi.com/
        res.json(response.data).status(200);
    }
    catch (err) {
        res.status(500).send(`Error retrieving words: ${err}`);
    }
})

export default router;