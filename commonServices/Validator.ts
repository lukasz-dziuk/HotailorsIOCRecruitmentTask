import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "../ioc/commonTypes";
import { ILogger } from "./iLogger";
import { IValidator } from "./iValidator";
import { IUserRequest } from "../HttpTrigger/utils/iUserRequest";
import { IError } from "../HttpTrigger/utils/iError";

@injectable()
export class Validator implements IValidator {
    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    public pokeReqValidation(req: IUserRequest, validTypes: string[]): void {
        const ids: string[] = req.id.split(",");
        const regex: RegExp = RegExp("^\\d+$");

        for (const id of ids) {
            if (!regex.test(id)) {
                const error: IError = {
                    status: 400,
                    message: "Please check your id parameter",
                };
                throw error;
            }
        }

        if (validTypes.indexOf(req.type) === -1) {
            const error: IError = {
                status: 400,
                message: "Please check your type parameter",
            };
            throw error;
        }

    }

}
