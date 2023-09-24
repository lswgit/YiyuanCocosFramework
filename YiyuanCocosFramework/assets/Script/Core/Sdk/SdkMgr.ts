import BaseSdk from "./BaseSdk";
import SdkInterface from "./SdkInterface";
import WxSdk from "./WxSdk";

export enum SDK_TYPE {
    PC = 0,				//PC
    WX_DEBUG, 		//微信测试
}

export default class SdkMgr {
    private sdkObj: SdkInterface = null;
    public constructor(sdkType: number) {
        switch (sdkType) {
            case SDK_TYPE.WX_DEBUG: //微信debug
                this.sdkObj = new WxSdk();
                break;
            default: //pc
                this.sdkObj = new BaseSdk();
                break;
        }
    }

    /**
     * 初始化
     * @param callback 初始化成功后回调
     * @param target 监听对象
     */
    public init(callback: Function, target: Object): void {
        console.log("SdkMgr init");
        this.sdkObj.init(callback, target);
    }

    /**
     * 登录
     * @param callback 登录成功后回调
     * @param target 监听对象
     */
    public login(callback: Function, target: Object): void {
        console.log("SdkMgr login");
        this.sdkObj.login(callback, target);
    }

    /**
     * 登出
     */
    public logout(): void {
        console.log("SdkMgr logout");
        this.sdkObj.logout();
    }

    /**
     * 退出
     */
    public exit(): void {
        console.log("SdkMgr exit");
        this.sdkObj.exit();
    }

    /**
     * 切换账号
     */
    public switchLogin(): void {
        console.log("SdkMgr switchLogin");
        this.sdkObj.switchLogin();
    }

    /**
     * 数据上报
     * @param param 参数
     */
    public report(...param: any[]): void {
        console.log("SdkMgr report");
        this.sdkObj.report(param);
    }

    /**
     * 数据上报
     * @param param 参数
     */
    public pay(...param: any[]): void {
        console.log("SdkMgr pay");
        this.sdkObj.pay(param);
    }

    /**
     * 主动拉起转发(小程序)
     */
    shareAppMessage(title: string = "", imageUrlId: string = "", imageUrl: string = "", query: any = null, shareCallback: any = null): void {
        this.sdkObj.shareAppMessage(title, imageUrlId, imageUrl, query, shareCallback);
    }
}