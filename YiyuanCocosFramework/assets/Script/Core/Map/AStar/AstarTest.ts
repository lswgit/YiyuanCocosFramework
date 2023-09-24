import MapGameData from "../MapGameData";
import SimpleAstar from "./SimpleAstar";

export default class AstarTest {
    private mapdata: number[][];
    private rootNode: cc.Node;
    private graphics: cc.Graphics;
    private myPos: cc.Vec2 = cc.Vec2.ZERO;
    private simpleAstar: SimpleAstar;
    private offsetX: number;
    private offsetY: number;
    private touchPos: cc.Vec2;
    private tgtPos: cc.Vec2;
    private pathNodes: any;
    private myNode: cc.Node;
    public constructor(mapdata: number[][], mapEditorNode: cc.Node) {
        this.mapdata = mapdata;
        this.rootNode = mapEditorNode.parent;
        this.simpleAstar = new SimpleAstar(mapdata);
        this.offsetX = mapEditorNode.width / 2;
        this.offsetY = mapEditorNode.height / 2;
    }

    public init() {
        this.myNode = new cc.Node();
        this.rootNode.addChild(this.myNode);
        this.myNode.x = this.myPos.x;
        this.myNode.y = this.myPos.y;
        var graphics = this.myNode.addComponent(cc.Graphics);
        this.drawPoint(graphics, 0, 0, 7.5, cc.Color.BLUE);

        var node = new cc.Node();
        this.rootNode.addChild(node);
        this.graphics = node.addComponent(cc.Graphics);
        var that = this;
        this.rootNode.parent.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.touchPos = event.getLocation();
        }.bind(this), this);
        this.rootNode.parent.on(cc.Node.EventType.TOUCH_END, function (event) {
            var W_poss = event.getLocation();
            if (this.touchPos.x != W_poss.x && this.touchPos.y != W_poss.y) {
                return;
            }
            let pos = this.rootNode.parent.convertToNodeSpaceAR(W_poss);
            that.tgtPos = new cc.Vec2(-this.rootNode.x + pos.x, -this.rootNode.y + pos.y);
            cc.log(that.tgtPos.x, that.tgtPos.y);
            var pathNodes = that.simpleAstar.find(this.offsetX + that.myPos.x, this.offsetY - that.myPos.y,
                this.offsetX + that.tgtPos.x, this.offsetY - that.tgtPos.y);
            if (!pathNodes) {
                cc.log("!pathNodes");
                return;
            }
            that.pathNodes = pathNodes;
            that.draw();

        }.bind(this), this);
    }

    private drawPoint(graphics: cc.Graphics, cx: number, cy: number, r: number, fillColor: cc.Color) {
        // 设置颜色
        graphics.fillColor = fillColor;
        // 绘制
        graphics.circle(cx, cy, r);
        // 确认绘制
        graphics.fill();
    }

    private draw() {
        this.graphics.clear();
        this.drawPoint(this.graphics, this.tgtPos.x, this.tgtPos.y, 7.5, cc.Color.GREEN);
        for (let index = 0; index < this.pathNodes.length; index++) {
            const element = this.pathNodes[index];
            var pos = this.getPosByIndex(element);
            this.drawPoint(
                this.graphics,
                pos.x,
                pos.y,
                3,
                cc.Color.WHITE
            );
        }
    }

    private getPosByIndex(element) {
        return {
            x: element.x * MapGameData.GameCellWidth + MapGameData.GameCellWidth / 2 - this.offsetX
            , y: - element.y * MapGameData.GameCellHeight - MapGameData.GameCellHeight / 2 + this.offsetY
        };
    }
}