export const state = () => ({
    key: "start",
});

export const mutations = {
    set_key(state, value) {
        state.key = value;
    },
};

export const actions = {
    refresh({ commit }) {
        const rval = Math.random().toString(36);
        commit("set_key", rval);
    },
};
