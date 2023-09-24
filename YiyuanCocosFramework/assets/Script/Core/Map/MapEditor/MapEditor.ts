import MapGameData from "../MapGameData";

export default class MapEditor {
    private mouseDown: number;
    public async init(mapNode: cc.Node, mapData) {
        mapNode.active = false;
        var width = MapGameData.GameCellWidth;
        var height = MapGameData.GameCellHeight;
        var blocks = mapData.blocks;
        for (let j = 0; j < blocks.length; j++) {
            for (let i = 0; i < blocks[j].length; i++) {
                let node = new cc.Node();
                mapNode.addChild(node);
                node.x = -mapNode.width / 2 + i * width + width / 2;
                node.y = mapNode.height / 2 - j * height - height / 2;
                // cc.log(j + "," + i + "," + node.x + "," + node.y);
                node.width = width;
                node.height = height;

                if (blocks[j][i] == 0) {
                    this.setBlock(node, true);
                }

                node.on(cc.Node.EventType.MOUSE_DOWN, (event: cc.Event.EventMouse) => {
                    this.mouseDown = event.getButton();
                    blocks[j][i] = this.mouseDown == cc.Event.EventMouse.BUTTON_LEFT ? 0 : 1;
                    this.setBlock(node, blocks[j][i] == 0);
                }, this);

                node.on(cc.Node.EventType.MOUSE_UP, (event) => {
                    this.mouseDown = -1;
                }, this);

                node.on(cc.Node.EventType.MOUSE_ENTER, (event) => {
                    if (this.mouseDown >= 0) {
                        blocks[j][i] = this.mouseDown == cc.Event.EventMouse.BUTTON_LEFT ? 0 : 1;
                        this.setBlock(node, blocks[j][i] == 0);
                    }
                }, this);

                node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                    event.stopPropagation();
                }, this);
            }
        }
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            if (event.keyCode == cc.macro.KEY.i) {
                mapNode.active = !mapNode.active;
            }
            else if (event.keyCode == cc.macro.KEY.w) {
                if (cc.sys.isBrowser) {
                    let textFileAsBlob = new Blob([JSON.stringify(mapData)], { type: 'application/json' });
                    let downloadLink = document.createElement("a");
                    downloadLink.download = "data.json";
                    downloadLink.innerHTML = "Download File";
                    if (window.webkitURL != null) {
                        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                    }
                    downloadLink.click();
                }
            }
        }, this);
    }

    public setBlock(node: cc.Node, block: boolean) {
        let graphics = node.getComponent(cc.Graphics);
        if (!graphics) {
            graphics = node.addComponent(cc.Graphics);
        }
        graphics.clear();
        if (block) {
            // 设置矩形的颜色
            var color = new cc.Color(255, 0, 0, 128); // 使用RGBA颜色表示，最后一个参数是透明度
            graphics.fillColor = color;
            // 绘制矩形
            graphics.fillRect(-node.width / 2, -node.height / 2, node.width - 1, node.height - 1);
            // 确认绘制
            graphics.fill();
        }
    }
}