import Instance from "./Instance";

class RandomUtils {

    public static getInstance(): RandomUtils {
        return Instance.get(RandomUtils);
    }
    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public limit($from: number, $end: number): number {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range: number = $end - $from;
        return $from + Math.random() * range;
    }

    /**
     * 获取一个区间的随机数(整数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public limitInteger($from: number, $end: number): number {
        return Math.floor(this.limit($from, $end + 1));
    }

    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    public randomArray(arr: Array<any>): any {
        if (!arr) {
            return null;
        }
        var index: number = Math.floor(Math.random() * arr.length);
        return arr[index];
    }
}
