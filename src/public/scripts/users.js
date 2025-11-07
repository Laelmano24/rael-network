const forms = document.querySelectorAll(".dashboard-player")
forms.forEach(form => {
    const buttons = form.querySelectorAll("button")
    const userId = form.querySelector(".userId").innerText
    const gameId = form.querySelector(".gameId").innerText
    const img = form.querySelector("img")

    fetch(`/api/get-users/${userId}`)
    .then(response => response.json())
    .then(data => {
        form.querySelector(".userId").innerText = data.name
        img.src = data.imageUrl
        img.alt = `Avatar de ${data.name}`
    })
    .catch(() => console.error("Erro ao carregar dados do jogador."))

    fetch(`/api/get-maps/${gameId}`)
    .then(response => response.json())
    .then(data => {
        form.querySelector(".gameId").innerText = data.name
    })
    .catch(() => console.error("Erro ao carregar dados do mapa."))

    buttons.forEach(button => {
        button.addEventListener("click", e => {
            e.preventDefault()

            const actionType = button.dataset.action

            form.action = `/dashboard/users/${userId}/${actionType}`
            form.submit()
        })
    })
})