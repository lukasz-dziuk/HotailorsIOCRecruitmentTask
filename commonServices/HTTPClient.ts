import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "../ioc/commonTypes";
import { ILogger } from "./iLogger";
import { IHTTPClient } from "./iHTTPClient";
import axios from "axios";

@injectable()
export class HTTPClient implements IHTTPClient {
    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    public async get(url: string): Promise<any> {
        try {
            const response: any = await axios.get(url);
            this._logger.info(`HTTPClient- Data succesfully fetched`);
            return response.data;
        } catch (error) {
            this._logger.error(`${JSON.stringify(error)}`);
            throw {
                status: error.response.status,
                message: error.message,
            };
        }
    }

}
