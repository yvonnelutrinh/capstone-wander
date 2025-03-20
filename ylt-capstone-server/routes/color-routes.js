import { Router } from "express";
import chroma from "chroma-js";
const router = Router();
// helper function to generate color palettes of different 'styles'
const generatePalette = (seedColor, style = 'default') => {
    const primaryColor = seedColor;
    const primary = chroma(primaryColor);
    const h = primary.get('hsl.h');
    const s = primary.get('hsl.s');
    const l = primary.get('hsl.l');
    
    let secondaryColor;
    
    switch(style) {
        case 'complementary': // opposite on color wheel
            secondaryColor = chroma.hsl((h + 180) % 360, s, l);
            break;
        case 'analogous': // close on color wheel
            secondaryColor = chroma.hsl((h + 30) % 360, s, l);
            break;
        case 'monochromatic': // same hue but different brightness/saturation
            secondaryColor = chroma.hsl(h, s - 0.3, l + 0.3);
            break;
        case 'vibrant': // increased saturation + contrast
            secondaryColor = chroma.hsl((h + 60) % 360, Math.min(1, s + 0.2), Math.min(0.9, l + 0.2));
            break;
        default: // default soft duotone
            secondaryColor = chroma.hsl((h + 50) % 360, Math.max(0.4, s - 0.1), Math.min(0.85, l + 0.15));
    }
    
    return chroma.scale([
        primaryColor,
        chroma.mix(primaryColor, secondaryColor, 0.3, 'lab'),
        chroma.mix(primaryColor, secondaryColor, 0.5, 'lab'),
        chroma.mix(primaryColor, secondaryColor, 0.7, 'lab'),
        secondaryColor
    ])
    .mode('lab')
    .colors(5, 'hex');
}

router.route('/').get(async (_req, res) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    console.log(randomColor);
    const palette = generatePalette(randomColor);
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
        const palette = generatePalette(seedColor);
        res.send(palette).status(200);
    }
    catch (error) {
        res.status(500).json({
            message: `Unable to generate palette from seed color: ${error}`,
        });
    }
})

export default router;