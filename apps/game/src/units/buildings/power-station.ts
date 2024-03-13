import { Continent } from "~/units/continent"
import { BuildingConfig } from "~/data"
import { PowerStationConfig, buildingModels } from "~/data/buildings"
import { Game } from "../.."
import { Building } from "./building"
import { Player } from "~/player"

/**
 * Represents a Mine building in the game.
 */
export class PowerStation extends Building<PowerStationConfig> {
  /** Timestamp of the last stone production. */
  lastEnergyProductionTime: number = Date.now()
  energyGeneratedEvent = new Event("energyGenerated")

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
      player,
      continent,
      config,
      game,
      // Use the mine building model
      buildingModel: buildingModels["power-station"],
    })
  }

  /**
   * Updates the state of the Mine.
   */
  update() {
    // Call the update method of the parent class (Building)
    super.update()
    // Produce stone resources
    this.produceEnergy()
  }

  /**
   * Produces stone resources if enough time has passed since the last production.
   */
  produceEnergy() {
    // Get the current timestamp
    const currentTime = Date.now()
    // Calculate the time passed since the last stone production in seconds
    const timePassedInSeconds = (currentTime - this.lastEnergyProductionTime) / 1000

    // Check if at least 1 second has passed since the last stone production
    if (timePassedInSeconds >= 1) {
      // Calculate the amount of stone produced based on the production rate
      const energyProduced = this.buildingModel.production.energy
      // Add the produced stone to the player's resources
      this.player.state.resources.stone += energyProduced
      // Update the timestamp of the last stone production
      this.lastEnergyProductionTime = currentTime

      // Log the production of stone (optional)
      //console.log(`+${energyProduced} energy produced`)
      // Dispatch an event indicating that stone has been generated (optional)
      // document.dispatchEvent(this.stoneGeneratedEvent);
    }
  }
}
