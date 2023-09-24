export default class UrlUtil {
    /**
     * 获取URL参数(字符串)
     * @param url 地址
     * @returns {string}
     */
    private static getParamString(url?: string): string {
        url = url || window.location?.href;
        if (url != void 0) {
            let index = url.indexOf('?');
            if (index != -1) {
                return url.substring(index + 1);
            }
        }
        return null;
    }

    /**
     * 获取URL参数
     * @param url 地址
     * @returns {JSON}
     */
    public static getParam(url?: string): { [key: string]: string } {
        let param = {};
        let paramString = this.getParamString(url);
        if (paramString) {
            paramString.split("&").forEach((value: string) => {
                let values = value.split("=");
                if (values.length == 2) {
                    param[values[0]] = values[1];
                }
            });
        }
        return param;
    }

    /**
     * 根据key获取URL参数
     * @param key key
     * @param url 地址
     * @returns {string}
     */
    public static getParamValue(key: string, url?: string): string {
        let paramString = this.getParamString(url);
        if (paramString) {
            let values = paramString.match(`(^|&)${key}=([^&]*)(&|$)`);
            if (values) {
                return values[2];
            }
        }
        return null;
    }
}