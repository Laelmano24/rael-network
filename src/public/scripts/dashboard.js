async function addRequestButton(parent) {
    const buttons = parent.querySelectorAll("button")
    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            const response = await fetch("/dashboard/commands", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                command: button.textContent.trim()
            })
        })

        if (response.ok) {
            console.log("Comando enviado com sucesso!")
        } else {
            console.log("Erro ao enviar comando.")
        }
        })
    })
}

addRequestButton(document.querySelector(".container-commands"))