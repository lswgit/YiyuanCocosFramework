type RState = { count: number, complete: boolean, on: Function[] };

export default class ResMgr {

    private static _instance: ResMgr;
    public static getInstance() {
        if (!this._instance) {
            this._instance = new ResMgr();
        }
        return this._instance;
    }

    private states: Map<string, RState> = new Map();

    public loadFile(path: string): Promise<cc.Asset> {
        if (!this.existFile(path)) return null;
        return new Promise((complete: Function) => {
            let state = this.getState(path, true);
            if (state.complete) {
                complete(cc.resources.get(path));
            } else {
                state.on.push(complete);
                if (state.count == 0) {
                    cc.resources.load(path, (error: Error, asset: cc.Asset) => {
                        if (error) {
                            cc.log(error.message);
                            return;
                        }
                        state.complete = true;
                        if (state.count == 0) {
                            state.on.forEach((on: Function) => {
                                on(null);
                            });
                            this._releaseFile(path);
                        } else {
                            state.on.forEach((on: Function) => {
                                on(asset);
                            });
                            state.on = [];
                        }
                    });
                }
            }
            state.count++;
        });
    }

    public releaseFile(path: string): void {
        let state = this.getState(path);
        if (state && state.count > 0) {
            if (--state.count == 0 && state.complete) {
                this._releaseFile(path);
            }
        }
    }

    private _releaseFile(path: string): void {
        let state = this.getState(path);
        if (state && state.complete) {
            cc.resources.release(path);
            this.states.delete(path);
        }
    }

    private getState(key: string, create?: boolean): RState {
        let state = this.states.get(key);
        if (create && !state) {
            state = { count: 0, complete: false, on: [] };
            this.states.set(key, state);
        }
        return state;
    }

    public existFile(path: string): boolean {
        let assetWith = null;
        let dirname = this.dirname(path) || "";
        let basename = this.basename(path) || path;
        let dirWith = cc.resources.getDirWithPath(dirname);
        for (let i = 0; i < dirWith.length; i++) {
            if (basename == this.basename(dirWith[i].path)) {
                assetWith = dirWith[i];
                break;
            }
        }
        if (!assetWith) {
            return false;
        }
        return true;
    }

    public basename(path: string, extname?: string): string {
        let index = path.indexOf("?");
        if (index > 0) path = path.substring(0, index);
        let reg = /(\/|\\)([^\/\\]+)$/g;
        let result = reg.exec(path.replace(/(\/|\\)$/, ""));
        if (!result) return path;
        let baseName = result[2];
        if (extname && path.substring(path.length - extname.length).toLowerCase() === extname.toLowerCase())
            return baseName.substring(0, baseName.length - extname.length);
        return baseName;
    }

    public dirname(path: string): string {
        var temp = /((.*)(\/|\\|\\\\))?(.*?\..*$)?/.exec(path);
        return temp ? temp[2] : '';
    }
}
