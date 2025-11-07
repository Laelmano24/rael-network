const player = document.querySelector(".dashboard-player-main")

if (player) {
    const id = player.querySelector("h3").innerText
    const img = player.querySelector("img")
    const textarea = player.querySelector(".dashboard-textarea")

    fetch(`/api/get-users/${id}`)
    .then(response => response.json())
    .then(data => {
        player.querySelector("h3").innerText = data.name
        img.src = data.imageUrl
        img.alt = `Avatar de ${data.name}`
    })
    .catch(() => console.error("Erro ao carregar dados do jogador."))

    player.addEventListener("submit", async (event) => {
        event.preventDefault()
        const message = textarea.value.trim()

        if (!message) return alert("Escreva uma mensagem antes de enviar!")

        try {
            const response = await fetch(`/dashboard/users/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            })

            const data = await response.json()
            if (!data.ok) { return }

            textarea.value = ""
            
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error)
        }
    })
}