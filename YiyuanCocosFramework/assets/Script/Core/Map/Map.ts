import MapTiles from "./MapTiles";

export default class Map {
    private tiles: MapTiles;
    private node: cc.Node;
    private mapData: any;

    constructor(node) {
        this.node = node;
    }

    public async init(mapId: number) {
        var that = this;
        await new Promise((complete: Function) => {
            cc.resources.load("/map/" + mapId + "/data", function (err, data) {
                if (err) {
                    cc.error(err.message || err);
                    complete();
                }
                var mapData: any = data.json;
                that.mapData = mapData;
                complete();
            });
        });

        this.tiles = new MapTiles(this.node);
        this.tiles.init(mapId, this.mapData);
        this.updateCameraPos(0, 0);
    }

    public updateCameraPos($x: number, $y: number): void {
        // cc.log($x + "," + $y);
        this.tiles.updateCameraPos($x, $y);
    }

    public getMapData() {
        return this.mapData;
    }
}