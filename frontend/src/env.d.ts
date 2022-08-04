/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_MAPS_API_KEY: string
    readonly VITE_BACKEND_FQDN: string
    readonly VITE_BACKEND_PORT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
