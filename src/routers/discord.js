import { Router } from "express"
import axios from "axios"
import jwt from "jsonwebtoken"
import "dotenv/config"

const { DISCORD_ID, DISCORD_SECRET, DISCORD_REDIRECT, JWT_SECRET } = process.env

const router = Router()

router.get("/login", (req, res) => {

    const url = `https://discord.com/oauth2/authorize?client_id=${DISCORD_ID}&response_type=code&redirect_uri=${DISCORD_REDIRECT}&scope=identify`

    return res.redirect(url)
})

router.get("/callback", async (req, res) => {
  try {
    const { code } = req.query
    if (!code) return res.status(401).json({ message: "The code is missing" })

    const responseToken = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: DISCORD_ID,
        client_secret: DISCORD_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )

    const { access_token } = responseToken.data
    if (!access_token) return res.status(401).json({ message: "Access token missing" })

    const responseUserData = await axios.get("https://discord.com/api/users/@me", {
      headers: { "Authorization": `Bearer ${access_token}` }
    })

    const { id, username } = responseUserData.data
    if (!id || !username) return res.status(401).json({ message: "The id or username is not exist" })

    const jwtToken = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", jwtToken, { maxAge: 604800000, httpOnly: true })
    res.redirect("/dashboard")

  } catch (error) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ message: "Something went wrong" })
  }
})

export default router