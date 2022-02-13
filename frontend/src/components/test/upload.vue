<template>
    <meta-busy v-if="$fetchState.pending" />
    <v-container v-else class="pa-10">
        <v-form ref="uploadform" enctype="multipart/form-data">
            <v-file-input
                v-model="file"
                counter
                chips
                show-size
                truncate-length="15"
                label="Upload"
                clearable
            />
            <v-btn color="primary" @click="upload">Submit</v-btn>
        </v-form>
        <v-data-table
            :headers="headers"
            :items="list"
            :search="filter"
            sort-by="['LastModified']"
        >
            <template v-slot:top>
                <fmt-table-header
                    filename="file-list.json"
                    :filter.sync="filter"
                    :list="list"
                    :title="title"
                >
                </fmt-table-header>
            </template>
        </v-data-table>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            file: null,
            filter: "",
            in_progress: false,
            uploads: {},
            list: [],
        }
    },
    computed: {
        title() {
            return `Uploaded Files (${this.list.length})`
        },
        headers() {
            return [
                {
                    text: "key",
                    value: "Key",
                    sortable: true,
                },
                {
                    text: "Last Modified",
                    value: "LastModified",
                    sortable: true,
                },
                {
                    text: "ETag",
                    value: "ETag",
                    sortable: true,
                },
                {
                    text: "Size",
                    value: "Size",
                    sortable: true,
                },
                {
                    text: "Storage Class",
                    value: "StorageClass",
                    sortable: true,
                },
            ]
        },
    },
    fetch() {
        return new Promise((resolve, _reject) => {
            this.$axios.get("/list_files").then((response) => {
                console.log("list_files", response)
                this.list = response.data.files
                resolve()
            })
        })
    },
    methods: {
        async submitfile(file) {
            this.uploads[file.name] = {
                file: file,
                progress: 0,
                status: "pending",
            }
            let formData = new FormData()
            formData.append("file", file)
            await this.$axios
                .post("/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (e) => {
                        this.uploads[file.name].progress = Math.round(
                            (e.loaded * 100) / e.total
                        )
                        console.log(
                            "progress",
                            this.uploads[file.name].progress
                        )
                    },
                })
                .then((res) => {
                    this.$success("Uploaded successfully", res)
                    this.$fetch()
                })
                .catch((err) => {
                    this.$error("Upload failed", err)
                })
        },
        upload() {
            console.log("upload", this.file)
            this.submitfile(this.file)
        },
    },
}
</script>
