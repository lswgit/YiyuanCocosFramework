export default class EventMgr extends cc.EventTarget {

    private static _instace: EventMgr = null;
    public static GetInstance() {
        if (EventMgr._instace == null) {
            EventMgr._instace = new EventMgr();
        }
        return EventMgr._instace;
    }

    /**
         * 注册事件目标的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
         * @param type 事件类型
         * @param callback 回调
         * @param target 目标
         */
    public static on(type: string, callback: Function, target?: any): void {
        this.GetInstance().on(type, callback, target);
    }

    /**
     * 注册事件目标的特定事件类型回调，回调会在第一时间被触发后删除自身。
     * @param type 事件类型
     * @param callback 回调
     * @param target 目标
     */
    public static once(type: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, target?: any): void {
        this.GetInstance().once(type, callback, target);
    }

    /**
     * 删除之前用同类型，回调，目标注册的事件监听器，如果只传递 type，将会删除 type 类型的所有事件监听器。
     * @param type 事件类型
     * @param callback 回调
     * @param target 目标
     */
    public static off(type: string, callback?: Function, target?: any): void {
        this.GetInstance().off(type, callback, target);
    }

    /**
     * 在当前 EventTarget 上删除指定目标（target 参数）注册的所有事件监听器。
     * @param target 目标
     */
    public static targetOff(target: Object): void {
        this.GetInstance().targetOff(target);
    }

    /**
     * 通过事件名发送自定义事件
     * @param type 事件类型
     * @param arg1 参数1
     * @param arg2 参数2
     * @param arg3 参数3
     * @param arg4 参数4
     * @param arg5 参数5
     */
    public static emit(type: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): void {
        this.GetInstance().emit(type, arg1, arg2, arg3, arg4, arg5);
    }

}
