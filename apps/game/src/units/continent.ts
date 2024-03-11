import { B } from "~/b"
import { ContinentConfig } from "~/data"
import { Unit } from "./unit"
import { sphericalPosition, rotateTowardsCenter } from "../utils"
import { Game } from ".."
import { Planet } from "./planet"

/**
 * Represents a continent in the game world.
 */
export class Continent extends Unit {
  config: ContinentConfig // Configuration of the continent
  planet: Planet
  type = "continent" // Type of the unit

  /**
   * Constructs a new Continent object.
   * @param planet The planet that the continent belongs to.
   * @param config Configuration of the continent.
   */
  constructor({ game, config }: { game: Game; config: ContinentConfig }) {
    // Call the constructor of the parent class (Unit)
    super({ game })

    this.config = config

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

    const planet = this.game.units.find(
      (u) => u.type === "planet" && u.config.id === config.planetId
    )

    if (!planet) {
      throw new Error("Continent must be created on a planet")
    }

    this.planet = planet as Planet

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
  }
}
