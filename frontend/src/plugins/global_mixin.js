import Vue from "vue"
import { mapState } from "vuex"
import * as tf from "@tensorflow/tfjs"
import { dataURLtoBlob } from "@/lib/libimg"
require("@tensorflow/tfjs-backend-cpu")
require("@tensorflow/tfjs-backend-webgl")

var CACHE = {}

var GlobalMixin = {
    computed: {
        ...mapState("images", ["_uploads", "_inprogress", "model_state"]),
        // ...mapState("images", ["_uploads"]),
        uploads() {
            return this._uploads
        },
        has_uploads() {
            return this.uploads.length > 0 || this.inprogress.length > 0
        },
        inprogress() {
            return this._inprogress
        },
        is_dev() {
            return this.$root.context.isDev
        },
        is_mobile() {
            return this.$vuetify.breakpoint.mobile
        },
        page_title: {
            get() {
                return this.$store.state.title.value
            },
            set(value) {
                console.log("set page_title", value)
                this.$store.commit("title/set", value)
            },
        },
        api_url() {
            return this.$root.context.env.BACKEND_URL
        },
        dark_mode: {
            get() {
                let val = this.$store.state.web_settings.dark_mode
                this.$vuetify.theme.dark = val
                return val
            },
            set(value) {
                this.$store.dispatch("web_settings/set_dark_mode", value)
                this.$vuetify.theme.dark = value
            },
        },
    },
    methods: {
        async sample_files() {
            var files = [
                "sample01.jpg",
                "sample02.jpg",
                "sample03.jpg",
                "sample05.jpg",
                "sample06.jpg",
                "sample07.jpg",
                "sample08.jpg",
            ]
            var retval = []
            for (var i = 0; i < files.length; i++) {
                var file = files[i]
                var url = `/samples/${file}`
                var blob = await fetch(url).then((r) => r.blob())
                retval.push(new File([blob], file, {
                    type: blob.type,
                }))
            }
            return retval
        },
        async clear() {
            await this.$store.dispatch("images/clear")
        },
        async UploadExists(filename) {
            const uploads_exists = this.uploads.find(
                (i) => i.filename === filename
            )
            const inprogress_exists = this.inprogress.find(
                (i) => i.filename === filename
            )
            let exists = []
            if (uploads_exists) {
                exists.push("uploads")
            }
            if (inprogress_exists) {
                exists.push("inprogress")
            }
            if (exists.length > 0) {
                this.$info(
                    `File ${filename} already exists in ${exists.join(", ")}`
                )
                return true
            } else {
                return false
            }
        },
        async get_ref(ref_id) {
            while (!this.$refs[ref_id]) {
                await new Promise((resolve) => setTimeout(resolve, 100))
            }
            return this.$refs[ref_id]
        },
        async doremove(sub) {
            console.log("remove", sub)
            await this.$store.dispatch("images/remove", sub.hash)
        },
        async doupload(files) {
            ;[...files].forEach(async (file) => {
                const reader = new FileReader()
                if (await this.UploadExists(file.name)) {
                    return
                }
                this.$store.dispatch("images/addInProgress", {
                    filename: file.name,
                    size: file.size,
                })
                reader.onloadend = async (evt) => {
                    if (evt.target.readyState === FileReader.DONE) {
                        this.$store.dispatch("images/add", {
                            src: evt.target.result,
                            file: file,
                        })
                    }
                }
                reader.readAsDataURL(file)
            })
        },
        async getTfInfo() {
            const indexeddb_name = `indexeddb://tf-model`
            const localcache = CACHE[indexeddb_name]
            if (localcache) {
                console.log("using local/ram cache")
                return localcache
            }
            const name_map = await fetch(`model/name_map.json`).then((res) =>
                res.json()
            )
            let model = null
            try {
                model = await tf.loadGraphModel(indexeddb_name)
                console.log("loaded model from indexeddb")
            } catch (e) {
                console.log(`No cached model found.`)
            }
            if (model === null) {
                model = await tf.loadGraphModel(`/model/model.json`)
                await model.save(indexeddb_name)
            }
            console.log("modal initialized: name_map", name_map)
            console.log("modal initialized: model", model)

            CACHE[indexeddb_name] = {
                model,
                name_map,
            }
            return CACHE[indexeddb_name]
        },
        async cropToCanvas(image, canvas, ctx) {
            let naturalWidth = image.naturalWidth
            let naturalHeight = image.naturalHeight
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.fillStyle = "#000000"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            const ratio = Math.min(
                canvas.width / naturalWidth,
                canvas.height / naturalHeight
            )
            const newWidth = Math.round(naturalWidth * ratio)
            const newHeight = Math.round(naturalHeight * ratio)
            console.log(newWidth, newHeight)
            console.log(canvas.width, canvas.height)
            ctx.drawImage(
                image,
                0,
                0,
                naturalWidth,
                naturalHeight,
                (canvas.width - newWidth) / 2,
                (canvas.height - newHeight) / 2,
                newWidth,
                newHeight
            )
        },
        async imageChange(e) {
            const { model, name_map } = await this.getTfInfo()
            const c = document.createElement("canvas")
            c.width = e.width
            c.height = e.height
            /**
             * @type {HTMLCanvasElement}
             */
            const ctx = c.getContext("2d")
            this.cropToCanvas(e, c, ctx)
            let [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3)
            const input = tf.tidy(() => {
                return tf.image
                    .resizeBilinear(tf.browser.fromPixels(c), [
                        modelWidth,
                        modelHeight,
                    ])
                    .div(255.0)
                    .expandDims(0)
            })
            return model.executeAsync(input).then((res) => {
                // Font options.
                console.log("async exec", res)
                const font = "14px sans-serif"
                ctx.font = font
                ctx.textBaseline = "top"

                const [boxes, scores, classes, valid_detections] = res
                const boxes_data = boxes.dataSync()
                const scores_data = scores.dataSync()
                const classes_data = classes.dataSync()
                const valid_detections_data = valid_detections.dataSync()[0]
                tf.dispose(res)
                var i
                let jarr = []
                for (i = 0; i < valid_detections_data; ++i) {
                    let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4)
                    x1 *= c.width
                    x2 *= c.width
                    y1 *= c.height
                    y2 *= c.height
                    const width = x2 - x1
                    const height = y2 - y1
                    const score = scores_data[i].toFixed(2)
                    const name = name_map[classes_data[i]]
                    jarr.push({
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2,
                        width: width,
                        height: height,
                        score: score,
                        name: name,
                    })
                    // Draw the bounding box.
                    ctx.strokeStyle = "#00FFFF"
                    ctx.lineWidth = 1
                    ctx.strokeRect(x1, y1, width, height)

                    // Draw the label background.
                    ctx.fillStyle = "#00FFFF"
                    const textWidth = ctx.measureText(`${name}:${score}`).width
                    const textHeight = parseInt(font, 10) // base 10
                    ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4)
                }
                for (i = 0; i < valid_detections_data; ++i) {
                    let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4)
                    x1 *= c.width
                    y1 *= c.height
                    const score = scores_data[i].toFixed(2)
                    const name = name_map[classes_data[i]]

                    // Draw the text last to ensure it's on top.
                    ctx.fillStyle = "#000000"
                    ctx.fillText(`${name}:${score}`, x1, y1)
                }
                ctx.width = c.width
                ctx.height = c.height
                return {
                    metadata: jarr,
                    dataUrl: c.toDataURL("image/png"),
                }
            })
        },
        async getMetaData(item) {
            return {
                metadata: item.metadata,
                hash: item.hash,
                ...item,
            }
        },
        async BackendUpload(item, metadata) {
            console.log("item", item)
            let formData = new FormData()
            formData.append("key", item.hash)
            formData.append("metadata", JSON.stringify(metadata))
            formData.append("filename", item.file.name)
            const blob = await dataURLtoBlob(item.src)
            formData.append("upload", blob, item.file.name)
            const dat = await this.$axios.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            return dat.data
        },
    },
}
Vue.mixin(GlobalMixin)
