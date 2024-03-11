import { Continent } from "~/units/continent"
import { BuildingConfig } from "~/data"
import { PowerStationConfig, buildingModels } from "~/data/buildings"
import { Game } from "../.."
import { Building } from "./building"
import { Player } from "~/player"

export class PowerStation extends Building<PowerStationConfig> {
  constructor({
    player,
    continent,
    config,
    game,
  }: {
    player: Player
    continent: Continent
    config: BuildingConfig
    game: Game
  }) {
    super({
      player,
      continent,
      config,
      game,
      buildingModel: buildingModels["power-station"],
    })
  }
}
