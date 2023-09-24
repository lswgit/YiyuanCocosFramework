import EventMgr from "../Event/EventMgr";

interface LanguageData {
    code: string; // 语言代码，如 "en", "fr"
    desc: string; // 语言描述
    texts: { [key: string]: string }; // 本地化文本
    font?: string; // 该语言的字体
    audio?: string; // 该语言的语音文件
}

export const LANGUAGECHANGEDEVENT: string = "LANGUAGECHANGEDEVENT";

// LocalizationManager.ts
export default class LocalizationManager {
    private static instance: LocalizationManager;

    private currentLanguage: string;
    private languages: LanguageData[];

    private constructor() {
        this.languages = [];
        this.currentLanguage = "en"; // 默认语言
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new LocalizationManager();
        }
        return this.instance;
    }

    public async init() {
        // 加载并解析多语言数据
        await this.loadLanguages();
    }

    private async loadLanguages() {
        const supportedLanguages = ["en", "zh", "fr", "es", "de", "ja", "ko", "ru", "ar", "pt"];
        const languageDescs = ["英语 (English)", "中文 (Chinese)", "法语 (French)", "西班牙语 (Spanish)", "德语 (German)"
            , "日语 (Japanese)", "韩语 (Korean)", "俄语 (Russian)", "阿拉伯语 (Arabic)", "葡萄牙语 (Portuguese)"];

        try {
            const languagePromises = supportedLanguages.map(async (langCode, index) => {
                return new Promise<LanguageData>((resolve, reject) => {
                    cc.resources.load(`languages/${langCode}`, cc.JsonAsset, (err, asset) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({
                                code: langCode,
                                desc: languageDescs[index],
                                texts: asset.json,
                                font: asset.json.font,
                                audio: asset.json.audio,
                            });
                        }
                    });
                });
            });

            this.languages = await Promise.all(languagePromises);
        } catch (error) {
            console.error("Failed to load language resources:", error);
        }
    }

    public setLanguage(languageCode: string) {
        const language = this.languages.find((lang) => lang.code === languageCode);
        if (language) {
            this.currentLanguage = languageCode;
            // 切换字体、音频等资源
            // 通知UI更新
            EventMgr.emit(LANGUAGECHANGEDEVENT);
        } else {
            console.warn(`Language '${languageCode}' is not supported.`);
        }
    }

    public getLocalizedString(key: string): string {
        const language = this.languages.find((lang) => lang.code === this.currentLanguage);
        if (language && language.texts[key]) {
            return language.texts[key];
        } else {
            console.warn(`Translation for key '${key}' not found in current language.`);
            return key;
        }
    }

    public getCurLanguageDesc(): string {
        for (const iterator of this.languages) {
            if (iterator.code == this.currentLanguage) {
                console.log(iterator.desc);
                return iterator.desc;
            }
        }
        return "";
    }

    public getCurLanguages(): LanguageData[] {
        return this.languages;
    }

    public setLanguageByIndex(index) {
        this.setLanguage(this.languages[index].code);
    }

    // 可以添加其他功能，如获取当前语言的字体、播放本地化语音等
}
