import { inject, injectable } from "inversify";
import { IFunctionService } from "./IFunctionService";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";
import { IUserRequest } from "../utils/IUserRequest";
import _ from "lodash";
import { IPokeService } from "./IPokeService";

@injectable()
export class FunctionService implements IFunctionService<any> {
    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    @inject(COMMON_TYPES.IPokeService)
    private readonly _pokeService: IPokeService;

    public async processMessageAsync(req: any): Promise<any> {

        try {

            const reqFormat: IUserRequest = this._pokeService.reqFormatter(req);
            const pokemons: string[] = await this._pokeService.findMatchingPokemons(reqFormat);

            return pokemons.length
                ? { status: 200, pokemons }
                : { status: 200, pokemons: "No id matches this type of pokemon" };

        } catch (error) {

            this._logger.error(`${JSON.stringify(error)}`);
            throw error;
        }

    }
}
