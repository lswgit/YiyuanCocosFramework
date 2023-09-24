const { ccclass, property } = cc._decorator;

@ccclass
export default class ConfigMgr extends cc.Component {
    @property([cc.JsonAsset])
    configFiles: cc.JsonAsset[] = [];

    private configData: { [key: string]: any } = {};

    onLoad() {
        this.loadConfigData();
    }

    loadConfigData() {
        for (const config of this.configFiles) {
            const key = config.name; // 使用文件名作为标识符
            this.configData[key] = config.json;
            cc.log(`Config data loaded for key "${key}":`, this.configData[key]);

            // 检查是否有配置更新，或者其他初始化操作
            // this.checkForConfigUpdate(key);
        }
    }

    getConfig(key: string) {
        if (this.configData[key]) {
            return this.configData[key];
        } else {
            cc.error(`Config key not found: ${key}`);
            return null;
        }
    }

    checkForConfigUpdate(key: string) {
        // 检查是否有新的配置数据可用
        // 这可以是从服务器下载的最新配置文件
        // 如果有新数据，可以触发一个事件或者执行相应的更新逻辑
        // 例如，this.updateConfig(key,newConfigData);
    }

    // 可以添加其他方法来更新配置数据、重新加载配置等
    updateConfig(key: string, newConfigData: any) {
        // 更新配置数据的逻辑
    }
}

