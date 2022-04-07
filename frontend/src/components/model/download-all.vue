<template>
    <span>
        <v-tooltip z-index="1000" bottom>
            <template v-slot:activator="{ on: tt }">
                <span v-on="tt">
                    <v-btn rounded class="primary" @click="download">
                        <v-icon>mdi-folder-zip</v-icon>
                        Download ALL
                    </v-btn>
                </span>
            </template>
            <span> Download All Images</span>
        </v-tooltip>
    </span>
</template>
<script>
import { db } from "@/lib/libstore"
import JSZip from "jszip"
import { dataURLtoBlob } from "@/lib/libimg"
import { saveAs } from "file-saver"

export default {
    methods: {
        async download() {
            let zip = new JSZip()
            let datestr = new Date().toISOString().split("T")[0]
            let ts = new Date().getTime()
            const bname = `trash-ai-images-${datestr}-${ts}`
            const zname = `${bname}.zip`
            let folder = zip.folder(bname)
            console.log(folder, zname)
            const out = this.uploads.map(async (upload) => {
                const dat = await db.trash.get(upload.hash)
                const blob = dataURLtoBlob(dat.processedDataUrl)
                const meta = await this.getMetaData(upload)
                const filenamebase = upload.filename.replace(/\.[^/.]+$/, "")
                const fbase = `${filenamebase}-${upload.hash}`
                const mname = `${fbase}.json`
                const pngname = `${fbase}.png`
                folder.file(pngname, blob)
                folder.file(mname, JSON.stringify(meta))
                return {
                    hash: upload.hash,
                    filename: upload.filename,
                    mname,
                    pngname,
                }
            })
            await Promise.all(out)
            zip.generateAsync({ type: "blob" }).then(function (blob) {
                saveAs(blob, zname)
            })
        },
    },
}
</script>
