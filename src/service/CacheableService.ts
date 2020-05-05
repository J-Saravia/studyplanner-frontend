/**
 * Class that provides a common base for cacheable services
 */
export default abstract class CacheableService<T extends {id?: K}, K = string> {

    private maxCacheAge = 1000 * 60 * 60 * 24; // How long the cache should be valid in milliseconds
    private cache: T[] = [];
    private loadingCache?: Promise<void>;
    private lastCacheUpdate: number = 0;

    public setMaxCacheAge(maxCacheAge: number) {
        this.maxCacheAge = maxCacheAge;
    }


    /**
     * Clears the cache, so that it will reload the data from the backend
     */
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

    /**
     * Load the cache from the abstract loadData method if needed
     */
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

    /**
     * Return a copy of the current cache
     */
    public async list(): Promise<T[]> {
        return await this.loadCache();
    }

    /**
     * Return one element from the cache
     * @param id
     */
    public async findById(id: K): Promise<T> {
        return (await this.loadCache()).find(element => element.id === id) as T;
    }

    /**
     * Provide data for the cache
     */
    protected abstract loadData(): Promise<T[]>;

}