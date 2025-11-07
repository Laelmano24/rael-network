import { Router } from "express"
import { encode, decode } from "js-base64"
import { getNameMap, getInfoPlayer } from "../utils/getRobloxInfo.js"
import { verifyExecutor } from "../utils/verifyExecutor.js"
import limiter from "../middlewares/rateLimiter.js"
import checkExecutor from "../middlewares/checkExecutor.js"
import axios from "axios"
import "dotenv/config"

const { WEBHOOK_URL } = process.env

const router = Router()

function capitalize(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}


router.get("/aGVsbG9sYWxhb21hbm9vawmaksjgdfdsd/:crypt", checkExecutor, limiter, async (req, res) => {

    const { crypt } = req.params
    const numberRegex = /^\d+$/
    const jobidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!crypt) return res.status(400).send("Parameter missing.")

    try {

        const decodeValues = decode(crypt)
        const tableinfo = decodeValues && decodeValues.split("|")
        const [userId, gameId, placeId, execName, jobId] = tableinfo

        if (!tableinfo || !gameId || !userId || !placeId || !execName || !jobId) {
            console.log("There are values ​that haven't arrived...")
            return res.status(400).send("Strange...")
        }

        if (!numberRegex.test(userId) || !numberRegex.test(gameId) || !numberRegex.test(placeId)) { return res.status(400).send("Strange...") }
        if (!jobidRegex.test(jobId)) { return res.status(400).send("Strange...") }

        if (!verifyExecutor(execName)) { return res.status(400).send("Strange...") }

        const host = `${req.protocol}://${req.get("host")}`
        
        let ip = req.headers["cf-connecting-ip"] 
        || req.headers["x-forwarded-for"]?.split(",")[0] 
        || req.socket.remoteAddress

        let country = "Unknown"

        try {

            const response = await axios.get("http://ip-api.com/json/" + ip)
            if (response?.data?.country) { country = response.data.country }

        } catch (err) {

            console.warn("Error searching for country:", err.message)

        }

        const infoPlayer = await getInfoPlayer(userId)
        const mapName = await getNameMap(gameId)

        if (!infoPlayer || !mapName) { return res.status(400).send("Strange...") }

        console.log(tableinfo)

        await axios.post(WEBHOOK_URL, {
            embeds: [
                {
                    title: "O usuário executou o Rael Hub.",
                    color: 0x3498db,
                    fields: [
                        {
                            name: "👤 Username",
                            value: `**${infoPlayer.name}**`,
                            inline: false
                        },
                        {
                            name: "🗺️ Map Name",
                            value: `**${mapName}**`,
                            inline: false
                        },
                        {
                            name: "💻 Executor",
                            value: `**${capitalize(execName)} executor**`,
                            inline: false
                        },
                        {
                            name: "🌍 Country",
                            value: `**${country}**`,
                            inline: true
                        },
                        {
                            name: "🔑 Server ID",
                            value: `**\`${jobId}\`**`,
                            inline: false
                        },
                        {
                            name: "🌀 Teleport code",
                            value: `game:GetService("TeleportService"):TeleportToPlaceInstance(${placeId}, "${jobId}")`,
                            inline: false
                        }
                    ],
                    thumbnail: {
                        url: infoPlayer.imageUrl
                    },
                    timestamp: new Date().toISOString(),
                    footer: {
                        text: "Rael hub logs"
                    }
                }
            ]
        })

        return res.status(200).send("Ok...")

    } catch (err) {
        console.error("Server error:\n", err)
        return res.status(500).json({ status: 500, message: "Server error: " + err.message })
    }
})

export default router
