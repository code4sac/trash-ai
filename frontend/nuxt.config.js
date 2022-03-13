// import colors from "vuetify/es5/util/colors";

const export_config = {
    /*
     ** Headers of the page
     ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
     */
    server: {
        host: "0.0.0.0",
        port: process.env.FRONTEND_PORT,
    },
    srcDir: "src/",
    head: {
        htmlAttrs: {
            lang: "en",
        },
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                hid: "description",
                name: "description",
                content: "Trash AI",
            },
            { name: "format-detection", content: "telephone=no" },
            {
                "http-equiv": "X-UA-Compatible",
                content: "IE=edge",
            },
            {
                name: "msapplication-TileColor",
                content: "#ffffff",
            },
            {
                name: "theme-color",
                content: "#ffffff",
            },
            {
                rel: "stylesheet",
                href: "https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css",
            },
            {
                rel: "apple-touch-icon",
                sizes: "180x180",
                href: "/apple-touch-icon.png",
            },
            {
                rel: "icon",
                type: "image/png",
                sizes: "32x32",
                href: "/favicon-32x32.png",
            },
            {
                rel: "icon",
                type: "image/png",
                sizes: "16x16",
                href: "/favicon-16x16.png",
            },
            {
                rel: "manifest",
                href: "/site.webmanifest",
            },
            {
                rel: "mask-icon",
                href: "/safari-pinned-tab.svg",
                color: "#23748b",
            },
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,
    env: {
        BACKEND_URL:
            process.env.NODE_ENV === "local"
                ? `/api`
                : `https://${process.env.BACKEND_FQDN}`,
        NODE_ENV: process.env.NODE_ENV,
    },
    /*
     ** Nuxt.js modules
     ** Doc: https://modules.nuxtjs.org
     */
    modules: ["@nuxtjs/vuetify", "@nuxtjs/axios", "@nuxtjs/proxy"],
    markdownit: {
        runtime: true, // Support `$md()`
    },
    build: {
        extend(config, ctx) {
            if (ctx.isDev) {
                config.devtool = ctx.isClient
                    ? "source-map"
                    : "inline-source-map"
            }
        },
    },
    ssr: false,
    target: "static",
    axios: {
        host: process.env.BACKEND_FQDN || "backend",
        port: process.env.BACKEND_PORT || 443,
        https: process.env.NODE_ENV !== "local",
        prefix: process.env.BACKEND_PREFIX || "/",
        proxy: process.env.NODE_ENV === "local",
    },

    /*
     ** Global CSS
     ** Doc: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-css
     */
    css: [],
    telemetry: false,
    proxy:
        process.env.NODE_ENV === "local"
            ? {
                "/api/": {
                    target: "http://backend:4000",
                    pathRewrite: { "^/api": "" },
                },
            }
            : {},
    /*
     ** Plugins to load before mounting the App
     ** Doc: https://nuxtjs.org/docs/2.x/directory-structure/plugins
     */
    plugins: [
        "~/plugins/lodash.js",
        "~/plugins/dropzone.js",
        "~plugins/clippy.js",
        "~plugins/crypto.js",
        "~plugins/filters.js",
        "~plugins/main.js",
        "~plugins/notify.js",
        "~plugins/persistedState.client.js",
        "~plugins/global_mixin.js",
        "~plugins/time.js",
    ],

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ["~/assets/variables.scss"],
        theme: {
            themes: {
                dark: {
                    primary: "#00AFFF",
                    secondary: "#000000",
                    accent: "#9E9E9E",
                    accent2: "#616161",
                    success: "#35912E",
                    error: "#B71C1C",
                    warning: "#E65100",
                    info: "#2196F3",
                },
                light: {
                    primary: "#0185FF",
                    secondary: "#A5D0F3",
                    accent: "#CCCED1",
                    accent2: "#BDBDBD",
                    success: "#1D9722",
                    error: "#FF6B6B",
                    warning: "#F9A825",
                    info: "#3F51B5",
                },
            },
        },
    },
}

console.log(export_config)
export default export_config
