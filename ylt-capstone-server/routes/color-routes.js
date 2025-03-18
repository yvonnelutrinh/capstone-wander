import { Router } from "express";
import chroma from "chroma-js";
// import axios from "axios";
// const COLORAPI_URL = "https://www.thecolorapi.com";
const router = Router();
// helper function to call colorAPI with a seed color
// const getColorPalette = async (seedColor) => {
//     const response = await axios.get(`${COLORAPI_URL}/scheme`, { params: { hex: seedColor, mode: "analogic" } })
//     return response.data.colors.map(({ hex }) => hex.value);
// }
// helper function to generate analogic color palette
const analogicPalette = (seedColor) => {
    return chroma.scale([
        chroma(seedColor).set("hsl.h", "-40").set("hsl.s", "0.45").set("hsl.l", "0.50"),
        chroma(seedColor).set("hsl.h", "-20").set("hsl.s", "0.55").set("hsl.l", "0.60"),
        chroma(seedColor),
        chroma(seedColor).set("hsl.h", "+20").set("hsl.s", "0.65").set("hsl.l", "0.70"),
        chroma(seedColor).set("hsl.h", "+40").set("hsl.s", "0.75").set("hsl.l", "0.80")
    ])
        .mode("lab")
        .colors(5, "hex");
}
router.route('/').get(async (_req, res) => {
    // https://www.thecolorapi.com/docs#schemes
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    // const palette = await getColorPalette(randomColor); // call color api
    console.log(randomColor);
    const palette = analogicPalette(randomColor);
    // console.log(palette);
    res.send(palette).status(200);
}).post(async (req, res) => {
    try {
        const validHex = /^(?:[0-9a-fA-F]{3}){1,2}$/; //check if user selected color is valid clean hex
        if (!validHex.test(req.body.seedColor)) {
            return res.status(400).json({
                message: "Please provide valid 6 digit hex code for seedColor",
            });
        }
        const seedColor = req.body.seedColor;
        // const palette = await getColorPalette(seedColor); // get color palette from api
        const palette = analogicPalette(seedColor);
        res.send(palette).status(200);
    }
    catch (error) {
        res.status(500).json({
            message: `Unable to generate palette from seed color: ${error}`,
        });
    }
})

export default router;