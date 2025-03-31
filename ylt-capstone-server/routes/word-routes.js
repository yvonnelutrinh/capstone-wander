import { Router } from 'express';
import { generate } from "random-words";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const words = generate({ exactly: 2 });
        res.json(words).status(200);

    }
    catch (err) {
        res.status(500).send(`Error retrieving words: ${err}`);
    }
})

export default router;