import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { readFileSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))

function checkExecution(req, res, next) {

    const userAgent = req.headers["user-agent"]
    const executionFileContent = readFileSync(join(__dirname, "..", "executorsList.json"), "utf-8")
    const browsersFileContent = readFileSync(join(__dirname, "..", "browsersList.json"), "utf-8")

    if (!executionFileContent || !browsersFileContent) return res.send("Cool")
        
    const executionFileData = JSON.parse(executionFileContent)
    const browsersFileData = JSON.parse(browsersFileContent)

    const isBrowsers = browsersFileData.some(value => {
        return userAgent.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    })

    const isPermission = executionFileData.some(value => {
        return userAgent.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    })

    if (isBrowsers) return res.render("blocked", { message: " This is not accessible to the browser" })
    if (isPermission) return next()

    if (userAgent.toLocaleLowerCase().includes("mozilla")) {
        return res.render("blocked", { message: "This is not accessible to the browser"})
    }

    res.status(500).send("Wow, are you a terribly terry king?")
}

export default checkExecution