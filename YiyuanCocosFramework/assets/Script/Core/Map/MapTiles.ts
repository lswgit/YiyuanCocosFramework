import MapGameData from "./MapGameData";
import MapTile from "./MapTile";

export default class MapTiles {

    private mapId: number;
    private tiles: any = [];
    private screenTiles: string[] = [];
    private cols: number;
    private rows: number;
    private node: cc.Node;

    constructor(node) {
        this.node = node;
    }

    public init(mapId: number, mapData: any) {
        this.mapId = mapId;
        this.cols = Math.floor(mapData.width / MapGameData.GameTileWidth);
        this.rows = Math.floor(mapData.height / MapGameData.GameTileHeight);
    }

    public updateCameraPos($x: number, $y: number): void {
        var currCol: number = Math.round($x / MapGameData.GameTileWidth);
        var currRow: number = Math.round($y / MapGameData.GameTileHeight);

        // 获取屏幕大小
        const screenSize = cc.view.getVisibleSize();
        // 获取屏幕宽度
        const screenWidth = screenSize.width;
        // 获取屏幕高度
        const screenHeight = screenSize.height;
        var screenCols: number = Math.ceil(screenWidth / MapGameData.GameTileWidth) + 1;
        var screenRows: number = Math.ceil(screenHeight / MapGameData.GameTileHeight) + 1;

        var halfScreenCols: number = screenCols;//Math.ceil(screenCols / 2);
        var halfScreenRows: number = screenRows;//Math.ceil(screenRows / 2);

        var minCol: number = currCol - halfScreenCols;
        var maxCol: number = currCol + halfScreenCols;
        if (minCol < 0) {
            maxCol += -minCol;
            minCol = 0;
        }
        if (maxCol > this.cols) {
            minCol -= (maxCol - this.cols);
            maxCol = this.cols;
        }
        var minRow: number = currRow - halfScreenRows;
        var maxRow: number = currRow + halfScreenRows;
        if (minRow < 0) {
            maxRow += -minRow;
            minRow = 0;
        }
        if (maxRow > this.rows) {
            minRow -= (maxRow - this.rows);
            maxRow = this.rows;
        }

        var screenTiles = [];
        // cc.log(minCol + "," + maxCol + "," + minRow + "," + maxRow);
        for (var i = minCol; i <= maxCol; i++) {
            for (var j = minRow; j <= maxRow; j++) {
                var tileKey: string = i + "_" + j;
                var tile: MapTile = this.tiles[tileKey];
                if (!tile) {
                    var node = new cc.Node();
                    this.node.addChild(node);
                    tile = node.addComponent(MapTile);
                    tile.init(this.mapId, i, j);
                    this.tiles[tileKey] = tile;
                }
                if (!tile.node.active) {
                    tile.node.active = true;
                }
                screenTiles.push(tileKey);
            }
        }

        //移除不在屏幕内的格子
        this.screenTiles.forEach(function (tileKey: string) {
            if (screenTiles.indexOf(tileKey) == -1) {
                var tile: MapTile = this.tiles[tileKey];
                tile.node.active = false;
            }
        }.bind(this));
        this.screenTiles = screenTiles;
    }

    public destory(): void {
        var keys: string[] = Object.keys(this.tiles);
        for (var i = 0; i < keys.length; i++) {
            var key: string = keys[i];
            var tile: MapTile = this.tiles[key];
            tile.destory();

            this.tiles[key] = null;
            delete this.tiles[key];
        }

        this.screenTiles.splice(0);
    }
}