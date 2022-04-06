import { dataURLtoHash } from "@/lib/libimg"
import { db } from "@/lib/libstore"
import _ from "lodash"

export const state = () => ({
    _uploads: [],
    _inprogress: [],
    model_state: false,
})

export const mutations = {
    clear(state) {
        state._uploads = []
        state._inprogress = []
        db.trash.clear()
    },
    setModelState(state, val) {
        // offline
        // loading
        // online
        state.model_loaded = val
    },
    addInProgress(state, obj) {
        state._inprogress.push(obj)
    },
    removeInProgress(state, filename) {
        console.log("removeInProgress", filename)
        state._inprogress = state._inprogress.filter(
            (o) => o.filename !== filename
        )
    },
    addImage(state, obj) {
        let ins = {
            hash: obj.hash,
            filename: obj.file.name,
            size: obj.file.size,
            type: obj.file.type,
            metadata: obj.metadata,
            width: obj.width,
            height: obj.height,
        }
        state._uploads.push(ins)
    },
    updateImage(state, obj) {
        let copy = _.cloneDeep(state._uploads)
        let item = copy.find((o) => o.hash === obj.hash)
        item = Object.assign(item, obj)
        copy.splice(copy.indexOf(item), 1, item)
        state._uploads = copy
    },
    removeImage(state, hash) {
        state._uploads = state._uploads.filter((image) => image.hash !== hash)
    },
    setUploaded(state, hash) {
        state._uploads.find((i) => i.hash === hash).uploaded = true
    },
}

export const actions = {
    async setModelLoaded({ commit }) {
        commit("setModelState", true)
    },
    async clear({ commit }) {
        commit("clear")
    },
    async remove({ commit }, hash) {
        commit("removeImage", hash)
        await db.trash.delete(hash)
    },
    async addInProgress({ state, commit }, obj) {
        commit("addInProgress", obj)
        const wait_sec = 20000
        setTimeout(() => {
            console.log("inprogress timeout", obj)
            if (state._inprogress.find((o) => o.filename === obj.filename)) {
                commit("removeInProgress", obj.filename)
                window.$nuxt.$error(
                    `File ${obj.filename} is taking too long to upload,` +
                        `or ran into an unexpected error, timedout after ${wait_sec}ms`
                )
            }
        }, wait_sec)
        console.log("after add in progress", obj)
    },
    async add({ commit }, obj) {
        const hash = await dataURLtoHash(obj.src)
        obj.hash = hash
        const img = document.createElement("img")
        img.onload = async () => {
            const val = await db.trash.get(hash)
            if (!val) {
                const proc = await window.$nuxt.imageChange(img)
                obj.width = img.width
                obj.height = img.height
                await db.trash.add({
                    hash: hash,
                    dataUrl: obj.src,
                    processedDataUrl: proc.dataUrl,
                    metadata: proc.metadata,
                })
                obj.metadata = proc.metadata
                commit("addImage", obj)
                commit("removeInProgress", obj.file.name)
                try {
                    const upldat = await window.$nuxt.BackendUpload(
                        obj,
                        proc.metadata
                    )
                    obj = {
                        ...{ hash: hash },
                        ...upldat,
                    }
                    commit("updateImage", obj)
                } catch (e) {
                    console.error(e)
                    window.$nuxt.$error(`Upload failed: ${e.message}`, e)
                    return
                }
            }
        }
        img.src = obj.src
    },
}
