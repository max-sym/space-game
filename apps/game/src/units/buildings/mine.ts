import { B } from "~/b"
import { Continent } from "~/units/continent"
import { BuildingConfig } from "~/data"
import { MineConfig, buildingModels } from "~/data/buildings"
import { Game } from "../.."
import { Building } from "./building"
import { Player } from "~/player"

/**
 * Represents a Mine building in the game.
 */
export class Mine extends Building<MineConfig> {
  /** Timestamp of the last stone production. */
  lastStoneProductionTime: number = Date.now()
  stoneGeneratedEvent = new Event("stoneGenerated")

  /**
   * Creates a new instance of the Mine class.
   * @param player The player who owns the mine.
   * @param continent The continent where the mine is located.
   * @param config Configuration of the mine building.
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
      player,
      continent,
      config,
      game,
      // Use the mine building model
      buildingModel: buildingModels["mine"],
    })
  }

  /**
   * Updates the state of the Mine.
   */
  update() {
    // Call the update method of the parent class (Building)
    super.update()
    // Produce stone resources
    this.produceStone()
  }

  /**
   * Produces stone resources if enough time has passed since the last production.
   */
  produceStone() {
    // Get the current timestamp
    const currentTime = Date.now()
    // Calculate the time passed since the last stone production in seconds
    const timePassedInSeconds = (currentTime - this.lastStoneProductionTime) / 1000

    // Check if at least 1 second has passed since the last stone production
    if (timePassedInSeconds >= 1) {
      // Calculate the amount of stone produced based on the production rate
      const stoneProduced = this.buildingModel.production.rate
      // Add the produced stone to the player's resources
      this.player.state.resources.stone += stoneProduced
      // Update the timestamp of the last stone production
      this.lastStoneProductionTime = currentTime

      // Log the production of stone
      //console.log(`+${stoneProduced} stone produced`)
      // Log the new player stone resource amount
      //console.log(`Player stone resources: ${this.player.state.resources.stone}`)
      // Dispatch an event indicating that stone has been generated (optional)
      // document.dispatchEvent(this.stoneGeneratedEvent);
    }
  }
}
