// Vue Component Install
import type { App } from 'vue'
// @ts-ignore
import InnerImageZoom from 'vue-inner-image-zoom'
import CopyButton from '@/components/copybutton.vue'
import TrashSummary from '@/components/trash_summary.vue'
import BusyIndicator from '@/components/meta/busy.vue'
import Code4SacIcon from '@/components/icon/code4sac.vue'
import DownloadAll from '@/components/model/download-all.vue'
import Download from '@/components/model/download.vue'
import Classify from '@/components/model/classify.vue'
import Thumb from '@/components/model/thumb.vue'
import UploadControl from '@/components/upload_control.vue'
import Progress from '@/components/progress.vue'
import Snack from '@/components/snack.vue'
import GMap from '@/components/gmap.vue'
import GMapSummary from '@/components/gmap_summary.vue'
import DragDropTitle from '@/components/drag_drop_title.vue'
import NoDetectGroup from '@/components/no_detect_group.vue'
import LabelSelector from '@/components/label_selector.vue'
import SearchAutoComplete from '@/components/search_autocomplete.vue'
import DetectedObjectsSummary from '@/components/detected_objects_summary.vue'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $snack: typeof Snack
    }
    export interface GlobalComponents {
        DetectedObjectsSummary: typeof DetectedObjectsSummary
        SearchAutoComplete: typeof SearchAutoComplete
        LabelSelector: typeof LabelSelector
        NoDetectGroup: typeof NoDetectGroup
        Classify: typeof Classify
        BusyIndicator: typeof BusyIndicator
        Code4SacIcon: typeof Code4SacIcon
        CopyButton: typeof CopyButton
        DownloadAll: typeof DownloadAll
        Download: typeof Download
        DragDropTitle: typeof DragDropTitle
        GMap: typeof GMap
        Progress: typeof Progress
        Snack: typeof Snack
        Thumb: typeof Thumb
        TrashSummary: typeof TrashSummary
        UploadControl: typeof UploadControl
        InnerImageZoom: typeof InnerImageZoom
        GMapSummary: typeof GMapSummary
    }
}

export const GlobalComponents = {
    // component(name: string) {
    //     return require(`@/components/${name}.vue`).default;
    // },
    install(app: App<any>) {
        componentList.forEach((Comp) => {
            app.component(Comp.name, Comp)
        })
    },
}

const componentList = [
    CopyButton,
    TrashSummary,
    BusyIndicator,
    Code4SacIcon,
    DownloadAll,
    Download,
    Thumb,
    UploadControl,
    Progress,
    Snack,
    GMap,
    Classify,
    DragDropTitle,
    InnerImageZoom,
    GMapSummary,
    NoDetectGroup,
    LabelSelector,
    SearchAutoComplete,
    DetectedObjectsSummary,
]
