import { Continent } from "~/units/continent"
import { BuildingConfig } from "~/data"
import { RocketLaunchingSiteConfig, buildingModels } from "~/data/buildings"
import { Game } from "../.."
import { Building } from "./building"
import { Player } from "~/player"

/**
 * Represents a Mine building in the game.
 */
export class RocketLaunchingSite extends Building<RocketLaunchingSiteConfig> {
  /** Timestamp of the last stone production. */

  /**
   * Creates a new instance of the PowerStation class.
   * @param continent The continent where the power-station is located.
   * @param config Configuration of the power-station building.
   * @param game The game instance.
   */
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
    // Call the constructor of the parent class (Building)
    super({
      config,
      game,
      // Use the mine building model
      buildingModel: buildingModels["rocket-launching-site"],
    })
  }
  update() {
    // Call the update method of the parent class (Building)
    super.update()
  }
}
