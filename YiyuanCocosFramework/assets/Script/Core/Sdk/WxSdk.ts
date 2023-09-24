declare var wx: any;
import SdkInterface from "./SdkInterface";
export default class WxSdk implements SdkInterface {

    private videoAd: any;
    private callback: any;
    private target: any;
    private bannerAd: any;
    private interstitialAd: any;
    private customAd: any;

    /**
     * 初始化
     * @param callback 初始化成功后回调
     * @param target 监听对象
     */
    public init(callback: Function, target: Object): void {
        console.log("WxSdk init");
        //转发
        wx.showShareMenu({
            withShareTicket: true,
            menus: ["shareAppMessage", "shareTimeline"]
        });
    }

    /**
     * 登录
     * @param callback 登录成功后回调
     * @param target 监听对象
     */
    public login(callback: Function, target: Object): void {
        console.log("WxSdk login");
    }

    /**
     * 登出
     */
    public logout(): void {
        console.log("WxSdk logout");
    }

    /**
     * 退出
     */
    public exit(): void {
        console.log("WxSdk exit");
    }

    /**
     * 切换账号
     */
    public switchLogin(): void {
        console.log("WxSdk switchLogin");
    }

    /**
     * 数据上报
     * @param param 参数
     */
    public report(...param: any[]): void {
        console.log("WxSdk report");
    }

    /**
     * 数据上报
     * @param param 参数
     */
    public pay(...param: any[]): void {
        console.log("WxSdk pay");
    }

    /**
     * 播放广告
     */
    playRewardAd(callback: Function, target: any): void {
        this.callback = callback;
        this.target = target;
        this.createRewardAd();

        // 用户触发广告后，显示激励视频广告
        this.videoAd.show().catch(() => {
            // 失败重试
            this.videoAd.load()
                .then(() => this.videoAd.show())
                .catch(err => {
                    console.log('激励视频 广告显示失败')
                    this.onRewardAdCallback(false);
                })
        })
    }

    createRewardAd() {
        if (!this.videoAd) {
            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: "adunit-"
            })

            this.videoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    // callback.call(target, true);
                    this.onRewardAdCallback(true);
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    // callback.call(target, false);
                    this.onRewardAdCallback(false);
                }
            })

            this.videoAd.onError(err => {
                // callback.call(target, false);
                // console.log(err, "1");
                this.onRewardAdCallback(false);
            })
        }
    }

    onRewardAdCallback(success) {
        if (this.callback) {
            this.callback.call(this.target, success);
            if (success) {
                this.videoAd.load();
            }
            this.callback = null;
        }
    }

    /**
     * 显示banner广告
     */
    showBannerAd(show: boolean): void {
        if (show) {
            // 在适合的场景显示 Banner 广告
            this.createBannerAd();
            this.bannerAd.show();
        }
        else {
            this.bannerAd.hide();
            this.bannerAd.destroy();
            this.bannerAd = null;
            this.createBannerAd();
        }
    }

    createBannerAd() {
        if (!this.bannerAd) {
            let sysInfo = wx.getSystemInfoSync();
            // 创建 Banner 广告实例，提前初始化
            var width = 320;
            this.bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-',
                adIntervals: 30, // 自动刷新频率不能小于30秒
                style: {
                    left: sysInfo.screenWidth / 2 - width / 2,
                    top: sysInfo.screenHeight,
                    width: width
                }
            })

            this.bannerAd.onResize(res => {
                this.bannerAd.style.top = sysInfo.screenHeight - this.bannerAd.style.realHeight;
            })

            this.bannerAd.onError(err => {
                console.log(err)
            })
        }
    }

    createInterstitialAd() {
        // 创建插屏广告实例，提前初始化
        if (wx.createInterstitialAd && !this.interstitialAd) {
            this.interstitialAd = wx.createInterstitialAd({
                adUnitId: 'adunit-'
            })

            this.interstitialAd.onClose(res => {
                this.interstitialAd = null;
                this.createInterstitialAd();
            })
        }
    }

    showInterstitialAd() {
        // 在适合的场景显示插屏广告
        this.createInterstitialAd();
        if (this.interstitialAd) {
            this.interstitialAd.show().catch((err) => {
                console.error(err)
            })
        }
    }

    /**
     * 显示自定义广告
     */
    showCustomAd(show, top?, left?): void {
        // console.log(top, left);
        if (!this.customAd) {
            this.customAd = wx.createCustomAd({
                adIntervals: 30,
                adUnitId: "adunit-",
                style: {
                    fixed: true,
                    left: left,
                    top: top,
                },
            })
        }
        if (show) {
            this.customAd.show();
        }
        else {
            this.customAd.destroy();
            this.customAd = null;
        }
    }

    /**
     * 主动拉起转发
     */
    shareAppMessage(title: string = "", imageUrlId: string = "", imageUrl: string = "", query: any = null, shareCallback: any = null): void {
        title = title;
        imageUrlId = imageUrlId;
        imageUrl = imageUrl;
        var data = {
            title: title,
            imageUrlId: imageUrlId,
            imageUrl: imageUrl,
            query: ""
        };
        wx.shareAppMessage(data);
    }
}