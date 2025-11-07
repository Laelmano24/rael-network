import { Router } from "express"
import axios from "axios"

const router = Router()

router.get("/loader", async (req, res) => {

    try {

        const response = await axios.get("https://scriptblox.com/api/script/Brookhaven-RP-Cartola-Hub-47454")
        const scriptContent = response.data.script.script
        res.set("Content-Type", "text/plain")
        res.send(scriptContent)

    } catch(err) {

        console.log("Error in scriptblox \n", err)

        try {

            const response = await axios.get("https://raw.githubusercontent.com/Davi999z/Cartola-Hub/refs/heads/main/Brookhaven")
            const scriptContent = response.data

            res.set("Content-Type", "text/plain")
            res.send(scriptContent)

        } catch(errorr) {

            console.log("Error in github \n", errorr)
            res.set("Content-Type", "text/plain")
            res.send('print("Choro")')

        }

    }



})


export default router