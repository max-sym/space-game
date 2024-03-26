import { BuildingConfig } from "~/data"
import { RocketLaunchingSiteConfig, buildingModels } from "~/data/buildings"
import { Game } from "../.."
import { Building } from "./building"
import { Rocket } from "../rocket"
import { B } from "~/b"

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
  constructor({ config, game }: { config: BuildingConfig; game: Game }) {
    // Call the constructor of the parent class (Building)
    super({
      config,
      game,
      // Use the mine building model
      buildingModel: buildingModels["rocket-launching-site"],
    })

    const rocket = new Rocket({
      config: {
        id: 11,
        position: this.position.clone(),
        rotation: this.rotation.clone(),
        color: "#110076",
        name: "Rocket 1",
        state: {
          velocity: new B.Vector3(0, 0, 0),
        },
        dimentions: {
          height: 0.3 * 5,
          length: 1 * 5,
          width: 0.3 * 5,
        },
        mass: 1,
      },
      game,
    })

    rocket.onKeydown = () => {
      const velocityChange = 0.01
      const horizontalVelocity = 0.1

      if (this.game.inputMap["w"] || this.game.inputMap["W"]) {
        rocket.config.state.velocity.y += velocityChange
        console.log("Increase velocity")
        rocket.disableGravity = true
      }
      if (this.game.inputMap["s"] || this.game.inputMap["S"]) {
        rocket.config.state.velocity.y -= velocityChange
        console.log("Decrease velocity")
      }
      if (this.game.inputMap["a"] || this.game.inputMap["A"]) {
        console.log("Strafe left")
        rocket.position.x -= horizontalVelocity
      }
      if (this.game.inputMap["d"] || this.game.inputMap["D"]) {
        console.log("Strafe right")
        rocket.position.x += horizontalVelocity
      }
    }

    this.game.units.push(rocket)

    rocket.disableGravity = true
  }

  update() {
    // Call the update method of the parent class (Building)
    super.update()
  }
}
