export const state = () => ({
    messages: [],
    new: 0,
    read: 0,
    poller: null,
})

export const mutations = {
    add_read(state, message) {
        state.messages.push(message)
        state.read++
    },
    add_new(state, message) {
        state.messages.push(message)
        state.new++
    },
    remove_new(state, key) {
        state.messages = state.messages.filter(
            (message) => message.key !== key
        )
        state.new--
    },
    remove_read(state, key) {
        state.messages = state.messages.filter(
            (message) => message.key !== key
        )
        state.read--
    },
    set_messages(state, messages) {
        state.messages = messages
    },
    set_previous(state, messages) {
        state.previous = messages
    },
    set_new(state, count) {
        state.new = count
    },
    set_read(state, count) {
        state.read = count
    },
    set_poller(state, poller) {
        state.poller = poller
    },
}

export const getters = {
    new(state) {
        return state.messages.filter((message) => message.state === "new")
    },
    read(state) {
        return state.messages.filter((message) => message.state === "read")
    },
}

const refresh_data = (commit) => {
    const url = "/admin/messages"
    return new Promise((resolve, reject) => {
        let newcnt = 0
        let readcnt = 0
        window.$nuxt.$api
            .get(url)
            .then((response) => {
                _.forEach(response, (message) => {
                    if (message.state == "new") {
                        newcnt++
                    } else {
                        readcnt++
                    }
                })
                commit("set_messages", response)
                commit("set_new", newcnt)
                commit("set_read", readcnt)
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
    })
}

const poller = (interval, commit) => {
    commit(
        "set_poller",
        setInterval(() => {
            console.log("polling")
            refresh_data(commit)
        }, interval)
    )
}

export const actions = {
    mark_read: async ({ commit }, message) => {
        window.$nuxt.$api
            .post("/admin/messages/mark_read", { key: message.key })
            .then((res) => {
                commit("add_read", res.data)
                commit("remove_new", message.key)
            })
    },
    mark_delete: async ({ commit }, message) => {
        window.$nuxt.$api
            .post("/admin/messages/mark_delete", { key: message.key })
            .then(() => {
                if (message.state == "new") {
                    commit("remove_new", message.key)
                } else {
                    commit("remove_read", message.key)
                }
            })
    },
    new: async ({ commit }, obj) => {
        const url = "/admin/messages/new"
        if (!obj.message) {
            throw new Error("Title is required")
        }
        if (!obj.type) {
            throw new Error("Type is required")
        }
        if (!obj.content) {
            obj.content = {}
        }
        window.$nuxt.$api
            .post(url, {
                title: obj.message,
                type: obj.type,
                content: obj.content,
            })
            .then((res) => {
                commit("add_new", res.data)
            })
    },
    refresh: async ({ commit }) => {
        refresh_data(commit)
    },
    start_polling: ({ commit }) => {
        poller(1000 * 60, commit)
    },
}
