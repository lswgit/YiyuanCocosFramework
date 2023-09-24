interface ITimer {
    tick: number;
    interval: number;
    repeat: number;
    func: Function;
    target: Object;
}

export default class TimerMgr {

    private timers: ITimer[] = [];

    public add(delay: number, repeat: number, func: Function, target: Object) {

        if (repeat == 0) {
            return;
        }

        this.remove(func, target);

        this.timers.push({
            tick: 0,
            interval: delay,
            repeat: repeat,
            func: func,
            target: target
        });
    }

    public remove(func: Function, target: Object) {
        for (let index = 0; index < this.timers.length; index++) {
            const element = this.timers[index];
            if (element.func == func && element.target == target) {
                this.timers.splice(index, 1);
                break;
            }
        }
    }

    public init() {
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, this.update, this);
    }

    public update(dt: number) {
        for (let index = 0; index < this.timers.length; index++) {
            const element = this.timers[index];
            element.tick += dt * 1000;
            if (element.tick >= element.interval) {
                element.tick -= element.interval;
                element.func.call(element.target);
                if (element.repeat > 0) {
                    element.repeat--;
                    if (element.repeat == 0) {
                        this.timers.splice(index, 1);
                        index--;
                    }
                }
            }
        }
    }
}
