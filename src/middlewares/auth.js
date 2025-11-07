import jwt from "jsonwebtoken"
import { readFileSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import "dotenv/config"

const { JWT_SECRET } = process.env

const __dirname = dirname(fileURLToPath(import.meta.url))
const response = readFileSync(join(__dirname, "..", "users.json"), "utf-8")
const users = JSON.parse(response)

function authDiscord(req, res, next) {

    const { token } = req.cookies
    if (!token) return res.redirect("/auth/discord/login")

    try {
        
        const user = jwt.verify(token, JWT_SECRET)
        const isAuth = users.some( id => id == user.id )
        if (!isAuth) return res.render("blocked", { message: "You are not allowed"})

        req.user = {}
        req.user.username = user.username

        next()

    } catch(err) {
        console.log("Login invalido")
        return res.redirect("/auth/discord/login")
    }

}

export { authDiscord }