import axios from "axios"
import { Router } from "express"

const router = Router()

router.get("/get-users/:userId", async (req, res) => {
    const { userId } = req.params

    if (!userId) return res.status(400).json({ status: 400, message: "Você não passou o ID do usuário." })

    try {

        const responseUserId = await axios.get("https://users.roblox.com/v1/users/" + userId)
        const responseImageUrl = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot`, {
            params: {
                userIds: userId,
                size: "420x420",
                format: "Png",
                isCircular: false
            }
        })

        const dataUserId = responseUserId.data
        const dataImgUrl = responseImageUrl.data

        if ( !dataUserId.id || !dataUserId.name ) {
            return res.status(404).json({ status: 404, message: "Usuario não encontrada para o ID informado." })
        }

        if (!dataImgUrl || !dataImgUrl.data || !dataImgUrl.data[0] || !dataImgUrl.data[0].imageUrl) {
            return res.status(404).json({ status: 404, message: "Imagem não encontrada para o ID informado." })
        }

        const imageUrl = dataImgUrl.data[0].imageUrl

        res.status(200).json({ id: dataUserId.id, name: dataUserId.name, imageUrl: imageUrl })

    } catch (err) {
        console.error("Erro ao pegar as info do user")
        return res.status(500).json({ message: "Erro interno" })
    }
})

export default router