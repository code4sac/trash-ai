const types = {
    clipnotify: {
        title: "Clipboard",
        icon: "mdi-clipboard-alert",
        timeout: 3000,
        color: "success",
    },
    success: {
        title: "Success",
        icon: "mdi-check",
        timeout: 2000,
        color: "success",
    },
    info: {
        title: "Info",
        icon: "mdi-information",
        timeout: 2000,
        color: "info",
    },
    quick: {
        title: "",
        icon: "mdi-information",
        timeout: 1000,
        color: "secondary",
    },
    error: {
        title: "Error",
        icon: "mdi-alert-octagram",
        timeout: 5000,
        color: "error",
    },
    warn: {
        title: "Warning",
        icon: "mdi-alert",
        timeout: 5000,
        color: "warning",
    },
};

export default ({ }, inject) => {
    Object.keys(types).forEach((type) => {
        inject(type, async (message, code) => {
            let opts = Object.assign({}, types[type], { message, code });
            window.$nuxt.$emit("notify", opts);
        });
    });
};
