import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import getContainer from "../ioc/inversify.config";
import { COMMON_TYPES } from "../ioc/commonTypes";
import { Logger } from "../commonServices/logger";
import { ILogger } from "../commonServices/iLogger";
import { IFunctionService } from "./services/IFunctionService";
import { IUserRequest } from "./utils/IUserRequest";
import { Container } from "inversify";

const httpTrigger: AzureFunction = async (ctx: Context, req: HttpRequest): Promise<any> => {
    if (
        (req.query.type && req.query.id) || (req.body && req.body.id && req.body.type)
    ) {
        const userRequest: IUserRequest = {
            id: req.query.id || req.body.id,
            type: req.query.type || req.body.type,
        };

        const container: Container = getContainer();
        const logger: Logger = container.get<ILogger>(COMMON_TYPES.ILogger) as Logger;
        logger.init(ctx, "1");

        const functionService: IFunctionService<any> =
            container.get<IFunctionService<any>>(COMMON_TYPES.IFunctionService);
        try {
            const response: any = await functionService.processMessageAsync(userRequest);

            ctx.res = {
                body: response,
                status: 200,
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
    } else {
        ctx.res = {
            status: 400,
            body: {
                status: 400,
                message:
                    "Please provide id and type parameter. You can use multiple ids in URL or separate them with commas in the body",
            },
            headers: { "Content-Type": "application/json" },
        };
        return ctx.res;
    }
};

export default httpTrigger;
