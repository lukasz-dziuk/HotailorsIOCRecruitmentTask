import { IUserRequest } from "../utils/iUserRequest";

export interface IPokeService {
    reqFormatter(req: any): IUserRequest;
    findMatchingPokemons(userRequest: IUserRequest): Promise<any>;
}
