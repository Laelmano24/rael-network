import { Router } from 'express'
import axios from 'axios'

const router = Router()

router.get('/get-maps/:gameId', async (req, res) => {
  const { gameId } = req.params

  try {

    const responseInfoMap = await axios.get(`https://games.roblox.com/v1/games?universeIds=${gameId}`)
    res.json({ name: responseInfoMap.data.data[0].name })

  } catch (error) {
    console.error('Erro ao buscar informações do mapa:', error.message)
    res.status(500).json({ error: 'Erro ao buscar informações do mapa' })
  }
})

export default router