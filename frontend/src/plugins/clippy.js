const clippy = (content) => {
    if (!navigator.clipboard) {
        window.$nuxt.$error("Clipboard API not supported");
    } else {
        navigator.clipboard
            .writeText(content)
            .then(() => {
                window.$nuxt.$clipnotify(content);
            })
            .catch((e) => {
                console.error("clipfail", e);
                window.$nuxt.$error(
                    "Clipboard copy failed! :(",
                    JSON.stringify(e, null, 4)
                );
            });
    }
};

export default ({}, inject) => {
    inject("clippy", clippy);
};
