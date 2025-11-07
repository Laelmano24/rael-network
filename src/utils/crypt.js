const key = "a491c082e3b77c92f84dbe3cde91f7f417be8c37d59a6b1d19f83b278ecb1f2"

function Encrypted(text) {
    const salt = Math.floor(Math.random() * 256)
    let result = String.fromCharCode(salt)
    for (let i = 0; i < text.length; i++) {
        const desloc = key.charCodeAt(i % key.length) + salt
        result += String.fromCharCode((text.charCodeAt(i) + desloc) % 256)
    }
    return btoa(result)
}

function Decrypted(text) {
    const decode = atob(text)
    const salt = decode.charCodeAt(0)
    let result = ''
    for (let i = 1; i < decode.length; i++) {
        const desloc = key.charCodeAt((i - 1) % key.length) + salt
        result += String.fromCharCode((decode.charCodeAt(i) - desloc + 256) % 256)
    }
    return result
}

export { Encrypted, Decrypted }