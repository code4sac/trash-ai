export const state = () => ({
    clipvalue: "",
});

export const mutations = {
    set(state, value) {
        state.clipvalue = value;
    },
    unset(state) {
        state.clipvalue = "";
    },
};
