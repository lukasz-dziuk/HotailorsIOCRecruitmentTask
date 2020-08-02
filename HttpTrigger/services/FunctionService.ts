import { inject, injectable } from "inversify";
import { IFunctionService } from "./IFunctionService";
import { COMMON_TYPES } from "../../ioc/commonTypes";
import { ILogger } from "../../commonServices/iLogger";
import { IUserRequest } from "../utils/IUserRequest";
import axios from "axios";
import _ from "lodash";

@injectable()
export class FunctionService implements IFunctionService<any> {
    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    public async processMessageAsync(userRequest: IUserRequest): Promise<any> {
        const ids: string[] = userRequest.id.split(",");
        const regex: RegExp = RegExp("^\\d+$");
        let idValidation: boolean = true;
        let pokemons: string[];

        _.forEach(ids, (id) => {
            if (!regex.test(id)) {
                idValidation = false;
                return false;
            }
        });

        if (!idValidation) {
            throw {
                status: 400,
                message: "Invalid request. Check id parameter",
            };
        }

        try {
            const fetchedPokemons: any = await axios.get(
                `https://pokeapi.co/api/v2/type/${userRequest.type
                    .trim()
                    .toLowerCase()}`);

            pokemons = _.chain(fetchedPokemons.data.pokemon)
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
        } catch (error) {
            if (error.response.status === 404) {
                throw {
                    status: 404,
                    message: "Request error, check if type parameter is correct",
                };
            } else {
                throw {
                    status: 500,
                    message: "Server error",
                };
            }
        }
        this._logger.info("Hello world");
        this._logger.verbose(`${JSON.stringify(userRequest)}`);

        return pokemons.length
            ? { status: 200, pokemons }
            : { status: 200, pokemons: "No id matches this type of pokemon" };
    }
}
