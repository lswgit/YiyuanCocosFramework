const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneManager extends cc.Component {
    @property(cc.Node)
    private loadingScreen: cc.Node = null; // 加载界面节点

    private currentScene: string = ""; // 当前场景名称
    private isLoading: boolean = false; // 是否正在加载场景

    // 预加载的场景名称列表
    @property([cc.String])
    private preloadScenes: string[] = [];

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        // 注册一个场景加载完成的回调
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);

        // 预加载所有场景
        this.preloadScenes.forEach((sceneName) => {
            cc.director.preloadScene(sceneName, () => {
                cc.log(`预加载场景: ${sceneName} 完成`);
            });
        });
    }

    onDestroy() {
        cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
    }

    // 切换到指定场景
    public async changeScene(sceneName: string) {
        if (this.isLoading) {
            cc.warn("正在加载场景，请稍候...");
            return;
        }

        if (sceneName === this.currentScene) {
            cc.warn(`当前已经在场景 ${sceneName} 中`);
            return;
        }

        this.isLoading = true;
        this.loadingScreen.active = true;

        await this.waitTwoSeconds();

        // 加载新场景
        cc.director.loadScene(sceneName);
    }

    async waitTwoSeconds(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000); // 2000毫秒等于2秒
        });
    }

    // 场景加载完成后的回调
    private onSceneLoaded(event: cc.Event.EventCustom) {
        this.isLoading = false;
        this.loadingScreen.active = false;

        const newSceneName: string = cc.director.getScene().name;
        cc.log(`切换到场景: ${newSceneName}`);

        this.currentScene = newSceneName;
    }
}
