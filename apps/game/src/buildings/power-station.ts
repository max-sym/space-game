import { Continent } from "~/continent"
import { BuildingConfig } from "~/data"
import { buildingModels } from "~/data/buildings"
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
