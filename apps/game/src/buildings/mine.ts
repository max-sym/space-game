import { Continent } from '~/continent';
import {
  BuildingConfig,
  buildingModels,
} from '~/data';
import { Game } from '..';
import { Building } from './building';

/**
 * Represents a Mine building in the game.
 */
export class Mine extends Building {
  /** Timestamp of the last stone production. */
  lastStoneProductionTime: number = Date.now();
  static stoneGeneratedEvent = new Event(
    'stoneGenerated'
  );

  /**
   * Creates a new instance of the Mine class.
   * @param continent The continent where the mine is located.
   * @param config Configuration of the mine building.
   * @param game The game instance.
   */
  constructor({
    continent,
    config,
    game,
  }: {
    continent: Continent;
    config: BuildingConfig;
    game: Game;
  }) {
    // Call the constructor of the parent class (Building)
    super({
      continent,
      config,
      game,
      // Use the mine building model
      buildingModel: buildingModels['mine'],
    });
  }

  /**
   * Updates the state of the Mine.
   */
  update() {
    // Call the update method of the parent class (Building)
    super.update();
    // Produce stone resources
    this.produceStone();
  }

  /**
   * Produces stone resources if enough time has passed since the last production.
   */
  produceStone() {
    // Get the current timestamp
    const currentTime = Date.now();
    // Calculate the time passed since the last stone production in seconds
    const timePassedInSeconds =
      (currentTime -
        this.lastStoneProductionTime) /
      1000;

    // Check if at least 30 seconds have passed since the last stone production
    if (timePassedInSeconds >= 30) {
      // Define the amount of stone to produce
      const stoneProduced = 10;
      // Add the produced stone to the continent's resources
      this.continent.addStone(stoneProduced);
      // Log the production of stone
      console.log(
        `+${stoneProduced} stone produced`
      );
      document.dispatchEvent(
        Mine.stoneGeneratedEvent
      );
      // Update the timestamp of the last stone production
      this.lastStoneProductionTime = currentTime;
    }
  }
}
