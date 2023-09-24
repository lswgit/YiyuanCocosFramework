import MapGameData from "./MapGameData";

export default class MapTile extends cc.Sprite {
    public col: number;
    public row: number;
    private tileResKey: string;

    public constructor() {
        super();
    }

    public init(mapId: number, col: number, row: number) {
        this.col = col;
        this.row = row;
        // 获取屏幕大小
        const screenSize = cc.view.getVisibleSize();
        // 获取屏幕宽度
        const screenWidth = screenSize.width;
        // 获取屏幕高度
        const screenHeight = screenSize.height;
        this.node.x = this.col * MapGameData.GameTileWidth - screenWidth / 2 + MapGameData.GameTileWidth / 2;
        this.node.y = screenHeight / 2 - this.row * MapGameData.GameTileHeight - MapGameData.GameTileHeight / 2;

        var tileResName: string = row + "_" + col;
        var tileResPath: string = "/map/" + mapId + "/" + tileResName;
        this.tileResKey = tileResPath;//"map_" + mapId + "_" + tileResName;

        var that = this;
        //异步加载
        cc.resources.load(tileResPath, (error: Error, asset: cc.Asset) => {
            if (error) {
                cc.log(error.message);
                return;
            }
            that.spriteFrame = new cc.SpriteFrame(asset as cc.Texture2D);
        });
    }

    public destory(): void {
        cc.resources.release(this.tileResKey);
        // App.DisplayUtils.removeFromParent(this);
        // RES.destroyRes(this.tileResKey);
        // this.texture = null;
    }
}