import {
    Mutation,
    VuexModule,
    Action,
    getModule,
    Module,
} from "vuex-module-decorators";
import { store } from "./main";

interface RouteState {
    key: string;
}

@Module({ dynamic: true, store, name: "clip", namespaced: true })
class Core extends VuexModule implements RouteState {
    key: string = "";

    @Action
    refresh(value: string) {
        this.key = Math.random().toString(36);
    }
}
export default getModule(Core);
