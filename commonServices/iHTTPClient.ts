export interface IHTTPClient {
    get(url: string): Promise<any>;
}
