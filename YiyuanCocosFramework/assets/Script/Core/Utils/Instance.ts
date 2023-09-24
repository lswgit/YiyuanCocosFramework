export type IClazz<T> = new (...param: any[]) => T;

export default class Instance {

    public static get<T>(clazz: IClazz<T>, ...param: any[]): T {
        if (clazz["__Instance__"] == null) {
            clazz["__Instance__"] = new clazz(...param);
        }
        return clazz["__Instance__"];
    }
}