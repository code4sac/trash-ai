const wrap = (str, charMax) => {
    let arr = []
    let space = /\s/

    const words = str.split(space)
    // push first word into new array
    if (words[0].length) {
        arr.push(words[0])
    }

    for (let i = 1; i < words.length; i++) {
        if (words[i].length + arr[arr.length - 1].length < charMax) {
            arr[arr.length - 1] = `${arr[arr.length - 1]} ${words[i]}`
        } else {
            arr.push(words[i])
        }
    }
    return arr
}

const split_on_length = (str, len) => {
    let lines = str.split("\n")
    let result = []
    for (let line of lines) {
        if (line.trim().length > 0) {
            result.push(line.trim())
        }
    }
    lines = []
    let wrapped = wrap(result.join(" "), len)
    _.forEach(wrapped, (line) => {
        lines.push(line)
    })
    return lines
}

export default {
    wrap: wrap,
    split_on_length: split_on_length,
}
