
export default class PathUtil {
    /**
     * 返回 Path 的扩展名
     * @param path 路径
     * @returns {string}
     */
    public static extname(path: string): string {
        var temp = /(\.[^\.\/\?\\]*)(\?.*)?$/.exec(path);
        return temp ? temp[1] : '';
    }

    /**
     * 获取文件路径的文件名。
     * @param path 路径
     * @param extname 扩展名
     * @returns {string}
     */
    public static basename(path: string, extname?: string): string {
        let index = path.indexOf("?");
        if (index > 0) path = path.substring(0, index);
        let reg = /(\/|\\)([^\/\\]+)$/g;
        let result = reg.exec(path.replace(/(\/|\\)$/, ""));
        if (!result) return path;
        let baseName = result[2];
        if (extname && path.substring(path.length - extname.length).toLowerCase() === extname.toLowerCase())
            return baseName.substring(0, baseName.length - extname.length);
        return baseName;
    }

    /**
     * 获取文件路径的目录名
     * @param path 路径
     * @returns {string} 
     */
    public static dirname(path: string): string {
        var temp = /((.*)(\/|\\|\\\\))?(.*?\..*$)?/.exec(path);
        return temp ? temp[2] : '';
    }
}