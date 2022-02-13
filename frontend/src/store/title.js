export const state = () => ({
    value: "Loading...",
});

export const mutations = {
    set(state, value) {
        state.value = value;
    },
};
