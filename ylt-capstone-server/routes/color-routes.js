import { Router } from "express";
import axios from "axios";
const COLORAPI_URL = "https://www.thecolorapi.com";

const router = Router();
const getColorPalette = async (basecolor) => {
    const response = await axios.get(`${COLORAPI_URL}/scheme`, { params: { hex: basecolor, mode: "analogic" } })
    return response.data.colors.map(({ hex }) => hex.value);
}

router.route('/').get(async (_req, res) => {
    // https://www.thecolorapi.com/docs#schemes
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const palette = await getColorPalette(randomColor);
    res.send(palette).status(200);
}).post(async (req, res) => {
    try {
        const validHex = /^(?:[0-9a-fA-F]{3}){1,2}$/;
        if (!validHex.test(req.body.seedColor)) {
            return res.status(400).json({
                message: "Please provide valid 6 digit hex code for seedColor",
            });
        }// user selects color
        const seedColor = req.body.seedColor;
        const palette = await getColorPalette(seedColor);
        res.send(palette).status(200);
    }
    catch (error) {
        res.status(500).json({
            message: `Unable to generate palette from seed color: ${error}`,
        });
    }
})

export default router;