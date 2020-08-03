import { IUserRequest } from "../HttpTrigger/utils/iUserRequest";

export interface IValidator {
    pokeReqValidation(req: IUserRequest, validTypes: string[]): void;
}
