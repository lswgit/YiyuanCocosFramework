const { ccclass } = cc._decorator;

@ccclass
export default class ObjectPoolMgr extends cc.Component {
    private static instance: ObjectPoolMgr = null;

    private objectPools: { [key: string]: cc.NodePool } = {};

    public static getInstance(): ObjectPoolMgr {
        if (this.instance === null) {
            this.instance = new ObjectPoolMgr();
        }
        return this.instance;
    }

    public createObjectPool(poolName: string, prefab: cc.Prefab, initialSize: number, maxSize: number = 100): void {
        if (!this.objectPools[poolName]) {
            const pool = new cc.NodePool();
            this.objectPools[poolName] = pool;

            for (let i = 0; i < initialSize; i++) {
                const node = cc.instantiate(prefab);
                pool.put(node);
            }
        }
    }

    public getObject(poolName: string): cc.Node {
        const pool = this.objectPools[poolName];
        if (pool && pool.size() > 0) {
            const node = pool.get();
            node.active = true;
            return node;
        }
        return null;
    }

    public putObject(poolName: string, node: cc.Node): void {
        const pool = this.objectPools[poolName];
        if (pool) {
            node.active = false;
            pool.put(node);
        }
    }

    public autoExpandPool(poolName: string, prefab: cc.Prefab, incrementSize: number = 10, maxSize: number = 100): void {
        const pool = this.objectPools[poolName];
        if (!pool) {
            this.createObjectPool(poolName, prefab, incrementSize, maxSize);
        } else if (pool.size() < maxSize) {
            for (let i = 0; i < incrementSize; i++) {
                const node = cc.instantiate(prefab);
                pool.put(node);
            }
        }
    }

    public clearPool(poolName: string): void {
        const pool = this.objectPools[poolName];
        if (pool) {
            pool.clear();
            delete this.objectPools[poolName];
        }
    }

    public getAllPoolNames(): string[] {
        return Object.keys(this.objectPools);
    }

    public getPoolSize(poolName: string): number {
        const pool = this.objectPools[poolName];
        if (pool) {
            return pool.size();
        }
        return 0;
    }
}