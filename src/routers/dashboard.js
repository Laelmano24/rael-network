import { WebSocketServer } from "ws"
import { Router } from "express"
import { Encrypted, Decrypted } from "../utils/crypt.js"
import { verifyExecutor } from "../utils/verifyExecutor.js"
import checkLimiter from "../utils/rateLimiter.js"

const discordRoute = Router()
const players = new Map()
const numberRegex = /^\d+$/

discordRoute.get("/", (req, res) => {

    const { username } = req.user
    if (!username) return res.status(401).json({ message: "Perhaps you are not authenticated." })

    const users = []

    for (let [userId, { gameId, nameExecutor }] of players.entries()) {
        users.push(userId)
    }

    res.render("dashboard", { username, users })
})

discordRoute.get("/users", (req, res) => {
    
    const { username } = req.user
    if (!username) return res.status(401).json({ message: "Perhaps you are not authenticated." })

    const users = []

    for (let [userId, { gameId, nameExecutor }] of players.entries()) {
        users.push({ userId, gameId, nameExecutor })
    }
    
    res.render("users", { username, users })

})

discordRoute.post("/send", (req, res) => {

    const { username } = req.user
    const { message } = req.body

    if (!message || !username) { 
        res.status(401).json({ message: "A request está invalida" })
    }

    try {

        for (let [userid, { ws }] of players.entries()) {
            ws.send(Encrypted(`[SERVER MESSAGE] ${message}`))
        }

        res.redirect("/dashboard")

    } catch(err) {
        console.log("Route erro /users/message:\n", err)
        return res.status(500).json({ message: "Apenas error" })
    }

})

discordRoute.post("/commands", (req, res) => {

    const { username } = req.user
    const { command } = req.body
    const commands = ["Kick", "Kill"]

    if (!command) return res.status(401).json({ message: "The command does not exist" })

    try {

        const isExist = commands.some(info => info === command)
        if (!isExist) return res.status(401).json({ message: "This command is not listed" })

        for (let [userid, { ws }] of players.entries()) {
            ws.send(Encrypted(`[USER ${command.toLocaleUpperCase()}] ${username}`))
        }
        
        res.status(200).json({ ok: true })

    } catch {
        console.log("Route erro /commands:\n", err)
        return res.status(200).json({ ok: false })
    }

})

discordRoute.get("/users/:userid", (req, res) => {

    const { userid } = req.params
    const { username } = req.user

    if (!userid || !username || !numberRegex.test(userid)) { 
        res.status(401).json({ message: "A request está invalida" })
    }

    try {

        const player = players.has(userid)
        if (!player) return res.render("user", { username, user: null })

        res.render("user", { username, user: userid })

    } catch(err) {
        console.log("Route erro /users/message:\n", err)
        return res.status(500).json({ message: "Apenas error" })
    }

})

discordRoute.post("/users/:userid", (req, res) => {

    const { userid } = req.params
    const { username } = req.user
    const { message } = req.body

    if (!message || !userid || !username || !numberRegex.test(userid)) { 
        res.status(401).json({ message: "A request está invalida" })
    }

    try {

        const { ws } = players.get(userid)
        if (!ws) return res.status(401).json({ message: "O user não existe" })

        ws.send(Encrypted(`[SERVER MESSAGE] ${message}`))

        res.status(200).json({ ok: true })

    } catch(err) {
        console.log("Route erro /users/message:\n", err)
        return res.status(200).json({ ok: false })
    }
})

discordRoute.post("/users/:userid/kick", (req, res) => {

    const { userid } = req.params
    const { username } = req.user

    if (!userid || !username || !numberRegex.test(userid)) { 
        res.status(401).json({ message: "A request está invalida" })
    }

    try {

        const { ws } = players.get(userid)
        if (!ws) return res.status(401).json({ message: "O user não existe" })

        ws.send(Encrypted(`[USER KICK] ${username}`))
        players.delete(userid)

        res.redirect("/dashboard/users")

    } catch(err) {
        console.log("Route erro /users/kick:\n", err)
        return res.status(500).json({ message: "Apenas error" })
    }
})

discordRoute.post("/users/:userid/kill", (req, res) => {

    const { userid } = req.params
    const { username } = req.user

    if (!userid || !username || !numberRegex.test(userid)) { 
        res.status(401).json({ message: "A request está invalida" })
    }

    try {

        const { ws } = players.get(userid)
        if (!ws) return res.status(401).json({ message: "O user não existe" })

        ws.send(Encrypted(`[USER KILL] ${username}`))

        res.redirect("/dashboard/users")

    } catch(err) {
        console.log("Route erro /users/kill:\n", err)
        return res.status(500).json({ message: "Apenas error" })
    }
})

function iniWebsocket(server) {

    const wss = new WebSocketServer({ server })

    wss.on("connection", async (ws, req) => {

        const limiter = await checkLimiter(req)
        if (!limiter) return

        let userid = null

        ws.on("message", mesage => {
            const data = Decrypted(mesage.toString())

            console.log(data)

            const [userId, gameId, nameExecutor] = data.split("|")
            const isExist = players.has(userId)

            if (isExist) return

            if (userid || !numberRegex.test(userId) || !numberRegex.test(gameId) || !verifyExecutor(nameExecutor)) return

            players.set(userId, { ws: ws, gameId: gameId, nameExecutor: nameExecutor })
            userid = userId
        })

        ws.on("close", () => {
            if (!userid) return
            players.delete(userid)
        })

        ws.on("error", () => {
            if (!userid) return
            players.delete(userid)
        })

        setInterval(() => {
            if (!userid) return
            ws.send(Encrypted("message from the server"))
        }, 3000)

    })

}

export { discordRoute, iniWebsocket }