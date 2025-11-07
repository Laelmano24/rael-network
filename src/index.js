import express from "express"
import axios from "axios"
import cookieParser from "cookie-parser"
import sendWebHook from "./routers/sendWebhook.js"
import loaderScript from "./routers/loaderScript.js"
import discord from "./routers/discord.js"
import getUser from "./routers/getUser.js"
import getMap from "./routers/getMap.js"
import { authDiscord } from "./middlewares/auth.js"
import { discordRoute, iniWebsocket } from "./routers/dashboard.js"
import { createServer } from "http"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import "dotenv/config"

const { PORT } = process.env
const app = express()
const server = createServer(app)

const __dirname = dirname(fileURLToPath(import.meta.url))

app.set("view engine", "ejs")
app.set("views", join(__dirname, "views"))
app.set("trust proxy", 1)

app.use(express.static(join(__dirname, "public")))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded())

app.use("/dashboard", authDiscord, discordRoute)
app.use("/auth/discord", discord)
app.use("/script", loaderScript)
app.use("/api", sendWebHook)
app.use("/api", authDiscord, getUser)
app.use("/api", authDiscord, getMap)

app.get("/", (req, res) => {
  res.redirect("https://rael-hub.xyz/")
})

app.get("/logout", (req, res) => {
  res.clearCookie('token')
  res.redirect("/")
})

iniWebsocket(server)
server.listen(PORT || 3000, () => console.log(`Servidor rodando ${PORT || 3000}`))
