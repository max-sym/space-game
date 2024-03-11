import { BuildingConfig } from "~/data"
import { PowerStationConfig, buildingModels } from "~/data/buildings"
import { Game } from "../.."
import { Building } from "./building"

export class PowerStation extends Building<PowerStationConfig> {
  constructor({ config, game }: { config: BuildingConfig; game: Game }) {
    super({
      config,
      game,
      buildingModel: buildingModels["power-station"],
    })
  }
}
