import { Router } from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import crypto from "crypto";
const knex = initKnex(configuration);
const router = Router();

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

const storeIpAgent = async (req, theme) => {
    try {
        const { ip, hash } = getIpHash(req);
        const userData = {
            ip,
            machine: hash,
            theme,
        };

        const existingUser = await knex("users")
            .where({ ip: ip, machine: hash }).first();

        await knex("users").update({
            ...existingUser,
            theme,
            palette: JSON.stringify(existingUser.palette)
        }).where({ id: existingUser.id })
        
        // await knex("users")
        //     .insert(userData)
        //     .onConflict(["machine", "ip"])
        //     .merge({
        //         "ip": userData.ip,
        //         "theme": userData.theme,
        //         "updated_at": knex.fn.now()
        //     });

    } catch (error) {
        console.error(`Error logging user: ${error}`);
    }
}

router.route('/').get(async (req, res) => {
    const { ip, hash } = getIpHash(req);
    const existingUser = await knex("users")
        .where({ ip, machine: hash }).first();
    if (existingUser) {
        res.status(200).send(existingUser.theme);
    } else {
        const defaultTheme = "dark";
        await storeIpAgent(req);
        res.status(200).send(defaultTheme);
    }
}).post(async (req, res) => {
    const { theme } = req.body;
    try {
        if (theme !== "light" && theme !== "dark") {
            return res.status(400).json({
                message: "Please provide valid theme (light or dark)",
            });
        }
        await storeIpAgent(req, theme);
        res.status(200).send(theme);
    } catch (error) {
        res.status(500).json({
            message: `Unable to update user theme prefence: ${error}`,
        });
    }
});

export default router;