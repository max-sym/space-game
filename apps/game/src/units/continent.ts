import { B } from "~/b"
import { ContinentConfig, buildingClasses } from "~/data"
import { Planet } from "./planet"
import { Unit } from "./unit"
import { Building } from "./buildings/building"
import { sphericalPosition, rotateTowardsCenter } from "../utils"
import { ModelType } from "~/data/buildings"
import { Player } from "~/player"

/**
 * Represents a continent in the game world.
 */
export class Continent extends Unit {
  // Properties
  planet: Planet // The planet that the continent belongs to
  config: ContinentConfig // Configuration of the continent
  buildings: Building<ModelType>[] = [] // Buildings present on the continent
  resources: { [resourceType: string]: number } = {} // Continent's resources (e.g., stone, metal)
  lastResourceLogTime: number = Date.now() // Timestamp of the last resource log

  player: Player

  /**
   * Constructs a new Continent object.
   * @param planet The planet that the continent belongs to.
   * @param config Configuration of the continent.
   */
  constructor({
    player,
    planet,
    config,
  }: {
    player: Player
    planet: Planet
    config: ContinentConfig
  }) {
    // Call the constructor of the parent class (Unit)
    super({ game: planet.game })
    this.player = player

    // Initialize properties
    this.planet = planet
    this.config = config
    this.resources["stone"] = 0 // Initial amount of stone resource (can be modified based on requirements)

    // Create the continent model
    this.model = B.CreateBox(
      config.name,
      {
        depth: config.depth,
        height: config.size,
        width: config.size,
      },
      this.game.scene
    )

    // Set material properties for the continent model
    const material = new B.StandardMaterial("continent", this.game.scene)
    material.diffuseColor = B.Color3.FromHexString("#00ff00")
    material.alpha = 1
    this.model.material = material

    // Set position and rotation of the continent
    this.position = this.planet.position.clone()
    const offset = sphericalPosition(
      new B.Vector3(),
      this.planet.config.diameter / 2 - config.offset,
      config.position.x * 360,
      config.position.y * 360
    )
    this.position = this.position.add(offset)
    this.rotation = rotateTowardsCenter(this.planet.position, this.position)

    // Populate buildings on the continent
    this.populateBuildings()
  }

  /**
   * Populates buildings on the continent based on the configuration.
   */
  populateBuildings() {
    this.config.buildings.forEach((buildingConfig) => {
      const buildingClass = buildingClasses[buildingConfig.type]
      const building = new buildingClass({
        player: this.player,
        continent: this,
        config: buildingConfig,
        game: this.game,
      })
      this.buildings.push(building)
    })
  }

  /**
   * Adds stone resources to the continent.
   * @param amount The amount of stone to add.
   */
  addStone(amount: number) {
    // Add the provided amount to the existing stone resource
    if (!this.resources["stone"]) {
      this.resources["stone"] = 567 // Initial stone amount (can be modified based on requirements)
    }
    this.resources["stone"] += amount
  }

  /**
   * Updates the state of the continent.
   */
  update() {
    // Call the update method of the parent class (Unit)
    super.update()

    // Update each building on the continent
    this.buildings.forEach((building) => building.update())

    // Log resource amount every 30 seconds
    if (Date.now() - this.lastResourceLogTime >= 30000) {
      this.logResourceAmount()
      this.lastResourceLogTime = Date.now()
    }
  }

  /**
   * Logs the amount of stone resources.
   */
  logResourceAmount() {
    console.log("Total Stone Amount:", this.resources["stone"])
  }
}
