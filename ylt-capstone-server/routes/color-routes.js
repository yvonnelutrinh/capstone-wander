import { Router } from "express";
import chroma from "chroma-js";
import initKnex from "knex";
import configuration from "../knexfile.js";
import crypto from "crypto";
const knex = initKnex(configuration);
const router = Router();

// helper function to generate color palettes of different 'styles'
const generatePalette = (seedColor, style = 'default') => {
    const primaryColor = seedColor;
    const primary = chroma(primaryColor);
    const h = primary.get('hsl.h');
    const s = primary.get('hsl.s');
    const l = primary.get('hsl.l');

    let secondaryColor;

    switch (style) {
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

const getIpHash = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
        return forwarded.split(",")[0].trim(); // get first IP in the list
    }
    const ip = req.connection?.remoteAddress || req.socket?.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    const hash = crypto.createHash("sha256").update(ip + userAgent).digest("hex");
    return { ip, hash };
};

const storeIpAgent = async (req, palette) => {
    try {
        const { ip, hash } = getIpHash(req);
        const userData = {
            ip: ip,
            machine: hash,
            palette: JSON.stringify(palette),
        };
        await knex("users")
            .insert(userData)
            .onConflict("machine")
            .merge({
                "ip" : userData.ip,
                "palette" : userData.palette,
                "updated_at": knex.fn.now()
            });

    } catch (error) {
        console.error(`Error logging user: ${error}`);
    }
}

router.route('/').get(async (req, res) => {
    const { ip, hash } = getIpHash(req);
    const existingUser = await knex("users")
        .where({ ip: ip, machine: hash }).first();
    if (existingUser) {
        res.status(200).send(existingUser.palette);
    } else {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
        const palette = generatePalette(randomColor);
        await storeIpAgent(req, palette);
        res.status(200).send(palette);
    }
}).post(async (req, res) => {
    try {
        const validHex = /^(?:[0-9a-fA-F]{3}){1,2}$/; //check if user selected color is valid clean hex
        if (req.body.seedColor && !validHex.test(req.body.seedColor)) {
            return res.status(400).json({
                message: "Please provide valid 6 digit hex code for seedColor",
            });
        }
        const seedColor = req.body.seedColor || Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
        const palette = generatePalette(seedColor);
        await storeIpAgent(req, palette);
        res.status(200).send(palette);
    }
    catch (error) {
        res.status(500).json({
            message: `Unable to generate palette from seed color: ${error}`,
        });
    }
})

export default router;