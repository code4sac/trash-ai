import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import About from '@/views/about.vue'
import Uploads from '@/views/uploads.vue'
import Summary from '@/views/summary.vue'
import Image from '@/views/image.vue'
import Detection from '@/views/detection.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'about',
        component: About,
    },
    {
        path: '/uploads/:idx',
        name: 'uploads',
        component: Uploads,
    },
    {
        path: '/image/:idx/:tab',
        name: 'image',
        component: Image,
    },
    {
        path: '/summary/:tab',
        name: 'summary',
        component: Summary,
    },
    {
        path: '/detection/:name',
        name: 'detection',
        component: Detection,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// browser back button

router.onError((error) => {
    console.log(error)
})

export default router
