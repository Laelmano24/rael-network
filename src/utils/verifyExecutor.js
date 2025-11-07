import { dirname, join } from "path"
import { fileURLToPath } from "url"
import { writeFileSync, readFileSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))

function verifyExecutor(executorName) {

    const whitelistPath = join(__dirname, "..", "executorsList.json")
    const contentFile = readFileSync(whitelistPath, "utf-8")
    const executors = JSON.parse(contentFile)

    const isExecutor = executors.some(execName => {
        const execNameLower = execName.toLocaleLowerCase()
        const executorNameLower = executorName.toLocaleLowerCase()

        return execNameLower === executorNameLower
    })

    return isExecutor

}

export { verifyExecutor }