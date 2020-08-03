import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";
import { IValidator } from "../../commonServices/iValidator";
import { IUserRequest } from "../utils/iUserRequest";
import _ from "lodash";
import { IPokeService } from "./IPokeService";
import { IError } from "../utils/iError";
import { IHTTPClient } from "../../commonServices/iHTTPClient";

@injectable()
export class PokeService implements IPokeService {
    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    @inject(COMMON_TYPES.IValidator)
    private readonly _validator: IValidator;

    @inject(COMMON_TYPES.IHTTPClient)
    private readonly _httpClient: IHTTPClient;

    private readonly _validPokeTypes: string[] = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy", "unknown", "shadow"];

    public reqFormatter(req: any): IUserRequest {
        if (
            (req.query.type && req.query.id) || (req.body && req.body.id && req.body.type)
        ) {
            const userRequest: IUserRequest = {
                id: req.query.id || req.body.id,
                type: req.query.type || req.body.type,
            };

            userRequest.id = userRequest.id.trim();
            userRequest.type = userRequest.type.trim().toLowerCase();
            this._validator.pokeReqValidation(userRequest, this._validPokeTypes);

            return userRequest;
        } else {
            const error: IError = {
                status: 400,
                message: "Please provide id and type parameter. You can use multiple ids in URL or separate them with commas in the body",
            };
            this._logger.error(`${JSON.stringify(error)}`);
            throw error;
        }
    }
    public async findMatchingPokemons(userRequest: IUserRequest): Promise<any> {

        const fetchedPokemons: any = await this._httpClient.get(`https://pokeapi.co/api/v2/type/${userRequest.type}`);
        const ids: string[] = userRequest.id.split(",");

        const pokemons: string[] = _.chain(fetchedPokemons.pokemon)
            .map((element) => {
                const urlSplitted: string[] = element.pokemon.url.split("/");
                return {
                    name: element.pokemon.name,
                    id: urlSplitted[urlSplitted.length - 2],
                };
            })
            .filter((element) => {
                return ids.indexOf(element.id) !== -1;
            })
            .map((element) => element.name)
            .value();

        return pokemons;
    }

}
