import Vue from "vue"

Vue.filter("capitalize", function (value) {
    if (!value) return ""
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter("truncate", function (value, length, suffix) {
    if (!suffix) {
        suffix = "..."
    }
    if (!value) {
        return ""
    }
    if (value.length <= length) {
        return value
    }
    return value.slice(0, length) + suffix
})

Vue.filter("title", function (value) {
    let sentence = value.toLowerCase().replace('_', ' ').split(" ")
    for (let i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
    }

    return sentence.join(" ")
})

Vue.filter("upper", function (value) {
    let sentence = value.toUpperCase()
    return sentence
})
