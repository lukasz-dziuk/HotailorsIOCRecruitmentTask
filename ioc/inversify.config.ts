import "reflect-metadata";
import { Container } from "inversify";
import { COMMON_TYPES } from "./commonTypes";

import { Logger } from "../commonServices/logger";
import { ILogger } from "../commonServices/iLogger";
import { HTTPClient } from "../commonServices/HTTPClient";
import { IHTTPClient } from "../commonServices/iHTTPClient";
import { Validator } from "../commonServices/Validator";
import { IValidator } from "../commonServices/iValidator";
import { IFunctionService } from "../HttpTrigger/services/IFunctionService";
import { FunctionService } from "../HttpTrigger/services/FunctionService";
import { PokeService } from "../HttpTrigger/services/PokeService";
import { IPokeService } from "../HttpTrigger/services/iPokeService";

const getContainer: (() => Container) = (): Container => {
    const container: Container = new Container();

    container
        .bind<ILogger>(COMMON_TYPES.ILogger)
        .to(Logger)
        .inSingletonScope();

    container
        .bind<IFunctionService<any>>(COMMON_TYPES.IFunctionService)
        .to(FunctionService);

    container
        .bind<IValidator>(COMMON_TYPES.IValidator)
        .to(Validator);

    container
        .bind<IHTTPClient>(COMMON_TYPES.IHTTPClient)
        .to(HTTPClient);
    container
        .bind<IPokeService>(COMMON_TYPES.IPokeService)
        .to(PokeService);

    return container;
};

export default getContainer;
