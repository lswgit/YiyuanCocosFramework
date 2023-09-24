const { ccclass, property } = cc._decorator;

@ccclass
export default class UI extends cc.Component {
    private visible: boolean = false;

    public async _open(...param: any[]): Promise<void> {
        this.node.active = true;
        await this.open(...param);
    }

    protected async open(...param: any[]): Promise<void> {

    }

    public async _close(): Promise<void> {
        this.node.active = false;
        this.close();
    }

    protected close(): void {

    }

    public _show(): void {
        if (this.visible) return;
        this.visible = this.node.active = true;
        this.onShow();
    }

    protected onShow(): void {

    }

    public _hide(): void {
        if (!this.visible) return;
        this.visible = this.node.active = false;
        this.onHide();
    }

    protected onHide(): void {

    }

    protected start(): void {

    }
}