import * as CryptoJS from "crypto-js"

export const dataURLtoBlob = async (dataurl) => {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = window.atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
}

export const dataURLtoHash = async (dataurl) => {
    const blob = await dataURLtoBlob(dataurl)
    const abuf = await blob.arrayBuffer()
    const wordArray = CryptoJS.lib.WordArray.create(abuf)
    return CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex)
}
