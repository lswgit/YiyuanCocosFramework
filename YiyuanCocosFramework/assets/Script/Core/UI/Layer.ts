export default class Layer extends cc.Node {
    constructor(name: string) {
        super(name);
    }

    public addUI(node: cc.Node): void {
        if (node.parent) {
            node.removeFromParent(false);
        }
        node.setAnchorPoint(0.5, 0.5);
        this.addChild(node);
    }

    public removeUI(node: cc.Node): void {
        if (node.isChildOf(this)) {
            node.removeFromParent(true);
            node.destroy();
        }
    }
}