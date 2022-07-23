//
// //     dark_mode: {
// //         get() {
// //             let val = this.$store.state.web_settings.dark_mode
// //             this.$vuetify.theme.dark = val
// //             return val
// //         },
// //         set(value) {
// //             this.$store.dispatch('web_settings/set_dark_mode', value)
// //             this.$vuetify.theme.dark = value
// //         },
// //     },
// //     page_title: {
// //         get() {
// //             return this.$store.state.title.value
// //         },
// //         set(value) {
// //             console.log('set page_title', value)
// //             this.$store.commit('title/set', value)
// //         },
// //     },
// //         async get_ref(ref_id) {
// //             while (!this.$refs[ref_id]) {
// //                 await new Promise((resolve) => setTimeout(resolve, 100))
// //             }
// //             return this.$refs[ref_id]
// //         },
// //         async BackendUpload(item, metadata) {
// //             console.log('item', item)
// //             let formData = new FormData()
// //             formData.append('key', item.hash)
// //             formData.append('metadata', JSON.stringify(metadata))
// //             formData.append('filename', item.file.name)
// //             const blob = await dataURLtoBlob(item.src)
// //             formData.append('upload', blob, item.file.name)
// //             const dat = await this.$axios.post('/upload', formData, {
// //                 headers: {
// //                     'Content-Type': 'multipart/form-data',
// //                 },
// //             })
// //             return dat.data
// //         },
// //     },
