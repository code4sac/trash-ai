import axios from 'axios';
import { log } from '@/lib/logging'


export class Axios {
    private static instance: Axios
    private baseUrl: string

    private constructor() {
        const port = import.meta.env.DEV ? ':5150' : ''
        const host = import.meta.env.DEV ? 'http://localhost' : 'https://${process.env.VITE_BACKEND_FQDN}'
        const urlpath = import.meta.env.DEV ? '/api' : ''
        this.baseUrl = `${host}${port}${urlpath}`
        log.info(`Axios base url: ${this.baseUrl}`)
    }

    async test() {
        return await axios.get(`${this.baseUrl}/test`)
    }

    public static getInstance() {
        if (!Axios.instance) {
            Axios.instance = new Axios()
            log.debug('Axios created')
        }
        return Axios.instance
    }
}
