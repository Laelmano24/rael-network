import axios from "axios"

async function getNameMap(gameId) {
   try {

    const responseInfoMap = await axios.get(`https://games.roblox.com/v1/games?universeIds=${gameId}`)
    res.json({ name: responseInfoMap.data.data[0].name })

  } catch (error) {
    console.error('Erro ao buscar informações do mapa:', error.message)
    return null
  }
}

async function getInfoPlayer(userId) {
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
    const imageUrl = dataImgUrl.data[0].imageUrl

    return { name: dataUserId.name, imageUrl: imageUrl }

  } catch (error) {
    console.error("Erro ao buscar informações do player:", error)
    return null
  }
}

export { getNameMap, getInfoPlayer }