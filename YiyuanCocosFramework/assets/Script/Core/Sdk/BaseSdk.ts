import SdkInterface from "./SdkInterface";
export default class BaseSdk implements SdkInterface {
    /**
     * 初始化
     * @param callback 初始化成功后回调
     * @param target 监听对象
     */
    public init(callback: Function, target: Object): void {
        cc.log("BaseSdk init");
    }

    /**
     * 登录
     * @param callback 登录成功后回调
     * @param target 监听对象
     */
    public login(callback: Function, target: Object): void {
        cc.log("BaseSdk login");
    }

    /**
     * 登出
     */
    public logout(): void {
        cc.log("BaseSdk logout");
    }

    /**
     * 退出
     */
    public exit(): void {
        cc.log("BaseSdk exit");
    }

    /**
     * 切换账号
     */
    public switchLogin(): void {
        cc.log("BaseSdk switchLogin");
    }

    /**
     * 数据上报
     * @param param 参数
     */
    public report(...param: any[]): void {
        cc.log("BaseSdk report");
    }

    /**
     * 数据上报
     * @param param 参数
     */
    public pay(...param: any[]): void {
        cc.log("BaseSdk pay");
    }

    /**
     * 播放广告
     */
    createRewardAd(): void {
    }
    /**
     * 播放广告
     */
    playRewardAd(callback: Function, target: any): void {
        callback.call(target, true);
    }
    /**
     * 显示banner广告
     */
    showBannerAd(show: boolean): void {
    }
    /**
     * 显示插屏广告
     */
    showInterstitialAd(): void { }
    /**
     * 显示自定义广告
     */
    showCustomAd(show, top?, left?): void { }
    /**
     * 主动拉起转发(小程序)
     */
    shareAppMessage(title: string, imageUrlId: string, imageUrl: string, query: any = null, shareCallback: any = null): void {
        if (shareCallback) {
            shareCallback();
        }
    }
}