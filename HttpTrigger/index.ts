import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import getContainer from "../ioc/inversify.config";
import { COMMON_TYPES } from "../ioc/commonTypes";
import { Logger } from "../commonServices/logger";
import { ILogger } from "../commonServices/iLogger";
import { IFunctionService } from "./services/IFunctionService";
import { IResponse } from "./utils/IResponse";
import { Container } from "inversify";

const httpTrigger: AzureFunction = async (ctx: Context, req: HttpRequest): Promise<any> => {

    const container: Container = getContainer();
    const logger: Logger = container.get<ILogger>(COMMON_TYPES.ILogger) as Logger;
    logger.init(ctx, "1");

    const functionService: IFunctionService<any> =
        container.get<IFunctionService<any>>(COMMON_TYPES.IFunctionService);
    try {
        const response: IResponse =
            await functionService.processMessageAsync(req);

        console.log(typeof response);
        ctx.res = {
            body: response,
            status: response.status,
            headers: { "Content-Type": "application/json" },
        };

        return ctx.res;
    } catch (error) {
        ctx.res = {
            body: { status: error.status, message: error.message },
            status: error.status,
            headers: { "Content-Type": "application/json" },
        };

        return ctx.res;
    }
};

export default httpTrigger;
