import urlJoin from 'url-join';
import AuthService from './AuthService';

export default class HttpClient {

    private static readonly config: Promise<{endpoint: string}> =
        fetch(`${process.env.PUBLIC_URL}/config/api.json`)
        .then(HttpClient.handleResponse);

    constructor(private relativeUrl: string) {}

    public get<T>(url: string = ''): Promise<T> {
        return this.request().url(url).fetch();
    }

    public getList<T>(url: string = ''): Promise<T[]> {
        return this.request().url(url).fetch();
    }

    public getOne<T>(id: string, url: string = ''): Promise<T> {
        return this.request().url(url, id).fetch();
    }

    public post<T>(data?: any, url: string = ''): Promise<T> {
        return this.request('POST').url(url).body(data).fetch();
    }

    public put<T>(id: string, data?: any, url: string = ''): Promise<T> {
        return this.request('PUT').url(url, id).body(data).fetch();
    }

    public delete(id: string, url: string = ''): Promise<void> {
        return this.request('DELETE').url(url, id).fetch();
    }

    public async generateUrl(...urlParts: any[]): Promise<string> {
        return urlJoin((await HttpClient.config).endpoint, this.relativeUrl, ...urlParts);
    }

    public request(method: string = 'GET'): Request {
        return new Request(this).method(method);
    }

    public static async handleResponse(response: Response) {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    }
}

export class Request {

    private _useAuthHeader = true;
    private _method = 'GET';
    private _body?: any;
    private _url = '';
    private _queryString = '';

    private readonly client: HttpClient;

    constructor(client: HttpClient) {
        this.client = client;
    }

    public noAuthHeader(): Request {
        this._useAuthHeader = false;
        return this;
    }

    public body(body?: any): Request {
        this._body = body;
        return this;
    }

    public url(...url: string[]): Request {
        this._url = urlJoin(url);
        return this;
    }

    public method(method: string): Request {
        this._method = method;
        return this;
    }

    public query(query: {[key: string]: any}): Request {
        let queryString = '?';
        Object.keys(query).forEach(key => {
            queryString += `${key}=${query[key]}&`
        });
        this._queryString = encodeURI(queryString.substr(0, queryString.length - 1));
        return this;
    }

    public async fetch<T>(init?: RequestInit): Promise<T> {
        const realInit: RequestInit = {
            ...init,
            body: JSON.stringify(this._body),
            method: this._method,
            headers: {
                ...init?.headers,
                ...await this.generateHeaders(),
            },
        };
        return fetch(await this.client.generateUrl(this._url, this._queryString), realInit).then(HttpClient.handleResponse);
    }

    private async generateHeaders(): Promise<HeadersInit> {
        const authHeader = this._useAuthHeader && await AuthService.INSTANCE.createAuthorizationHeader();
        const payloadHeader = !!this._body && {
            'Content-Type': 'application/json'
        };
        return {
            ...payloadHeader,
            ...authHeader,
            'Accept': 'application/json',
        }
    }

}