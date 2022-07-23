export const state = () => ({
    dark_mode: false,
});

export const mutations = {
    set_dark_mode(state, dark_mode) {
        state.dark_mode = dark_mode;
    },
};

export const actions = {
    // ************************
    // SAVE
    // ************************
    set_dark_mode({ commit }, dark_mode) {
        commit("set_dark_mode", dark_mode);
        window.$nuxt.$emit("set_dark_mode", dark_mode);
    },
};
