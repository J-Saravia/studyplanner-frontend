export default abstract class CacheableService<T extends {id?: K}, K = string> {

    private maxCacheAge = 1000 * 60 * 60 * 24; // How long the cache should be valid in milliseconds
    private cache: T[] = [];
    private loadingCache?: Promise<void>;
    private lastCacheUpdate: number = 0;

    public setMaxCacheAge(maxCacheAge: number) {
        this.maxCacheAge = maxCacheAge;
    }

    public async clearCache(): Promise<void> {
        if (this.loadingCache) {
            await this.loadingCache;
        }
        await (this.loadingCache = new Promise(async resolve => {
            this.cache = [];
            this.lastCacheUpdate = 0;
            this.loadingCache = undefined;
            resolve();
        }));
    }

    protected async loadCache(): Promise<T[]> {
        if (this.lastCacheUpdate + this.maxCacheAge < Date.now()) {
            if (!this.loadingCache) {
                await (this.loadingCache = new Promise(async (resolve, reject) => {
                    try {
                        this.cache = await this.loadData();
                        this.lastCacheUpdate = Date.now();
                    } finally {
                        this.loadingCache = undefined;
                        resolve();
                    }
                }));
            } else {
                await this.loadingCache;
            }
        }
        return this.cache.filter(_ => true);
    }

    public async list(): Promise<T[]> {
        return await this.loadCache();
    }

    public async findById(id: K): Promise<T> {
        return (await this.loadCache()).find(element => element.id === id) as T;
    }

    protected abstract loadData(): Promise<T[]>;

}