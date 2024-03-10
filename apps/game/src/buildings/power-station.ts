import { Continent } from "~/continent"
import { BuildingConfig, buildingModels } from "~/data"
import { Game } from ".."
import { Building } from "./building"

export class PowerStation extends Building {
  constructor({
    continent,
    config,
    game,
  }: {
    continent: Continent
    config: BuildingConfig
    game: Game
  }) {
    super({
      continent,
      config,
      game,
      buildingModel: buildingModels["power-station"],
    })
  }
}
