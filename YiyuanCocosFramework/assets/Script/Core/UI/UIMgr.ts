import Layer from "./Layer";
import ResMgr from "./ResMgr";
import UI from "./UI";

interface IPrefabState {
    loading: boolean;
    node: cc.Node;
    on: Function[];
}

export default class UIMgr {

    private canvas: cc.Canvas = null;
    private rootLayer: Layer = null;
    private uiLayer: Layer = null;
    private popupLayer: Layer = null;
    private tipsLayer: Layer = null;
    private prefabState: { [path: string]: IPrefabState } = {};

    private static _instance: UIMgr;
    public static GetInstance() {
        if (!this._instance) {
            this._instance = new UIMgr();
            this._instance.init();
        }
        return this._instance;
    }

    public init(): void {
        let scene = cc.director.getScene();
        this.canvas = scene.getComponentInChildren(cc.Canvas);
        if (!this.canvas) {
            return;
        }
        this.initCanvas();
        this.createLayer();
    }

    private initCanvas(): void {
        let size = cc.size(960, 640);
        let canvas = this.canvas;
        canvas.node.setContentSize(size);
        canvas.designResolution = size;
        canvas.fitWidth = canvas.fitHeight = true;
    }

    private createLayer(): void {
        let canvas = this.canvas.node;
        this.rootLayer = new Layer("rootLayer");
        canvas.addChild(this.rootLayer);
        this.uiLayer = new Layer("uiLayer");
        this.rootLayer.addChild(this.uiLayer);
        this.popupLayer = new Layer("popupLayer");
        this.rootLayer.addChild(this.popupLayer);
        this.tipsLayer = new Layer("tipsLayer");
        this.rootLayer.addChild(this.tipsLayer);
    }

    private openUI(layer: Layer, path: string, ...param: any[]): Promise<cc.Node> {
        return new Promise(async (complete: Function) => {
            if (!this.prefabState[path]) {
                this.prefabState[path] = { loading: true, node: null, on: [] };
                let prefab = await ResMgr.getInstance().loadFile(path) as cc.Prefab;
                if (!prefab) {
                    return complete(null);
                }
                this.prefabState[path].node = cc.instantiate(prefab);
                this.prefabState[path].loading = false;
            }

            let state = this.prefabState[path];
            if (state) {
                state.on.push(complete);
                if (!state.loading) {
                    let node = state.node;
                    let ui = node.getComponent(UI);
                    if (!ui) {
                    }
                    let time = cc.director.getTotalTime();
                    await ui?._open(...param);
                    if (node.isValid) {
                        layer.addUI(node);
                        state.on.forEach((on: Function) => {
                            on(node);
                        });
                    } else {
                        state.on.forEach((on: Function) => {
                            on(null);
                        });
                    }
                    state.on = [];
                }
            }
        });
    }

    private async closeUI(layer: Layer, path: string): Promise<void> {
        let state = this.prefabState[path];
        if (!state) {
            return;
        }
        if (!state.loading) {
            let inst = state.node;
            await inst.getComponent(UI)?._close();
            layer.removeUI(inst);
        }
        ResMgr.getInstance().releaseFile(path);
        delete this.prefabState[path];
    }

    public async openPage(path: string, ...param: any[]): Promise<cc.Node> {
        return await this.openUI(this.uiLayer, path, ...param);
    }

    public async closePage(path: string): Promise<void> {
        await this.closeUI(this.uiLayer, path);
    }

    public async openPopup(path: string, ...param: any[]): Promise<cc.Node> {
        return await this.openUI(this.popupLayer, path, ...param);
    }

    public async closePopup(path: string): Promise<void> {
        await this.closeUI(this.popupLayer, path);
    }

    public async addTips(path: string): Promise<cc.Node> {
        let node = cc.instantiate(await ResMgr.getInstance().loadFile(path) as cc.Prefab);
        this.tipsLayer.addChild(node);
        return node;
    }
}