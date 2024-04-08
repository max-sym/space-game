import { B } from "~/b"
import { PlanetConfig } from "~/data"
import { Game } from ".."
import { Unit } from "./unit"

export class Planet extends Unit {
  config: PlanetConfig
  type = "planet"

  constructor({ game, config }: { game: Game; config: PlanetConfig }) {
    super({ game, type: "planet" })
    this.config = config
    this.position = this.config.position.clone()

    // Create the planet mesh
    this.model = B.CreateSphere(
      this.config.name,
      { segments: 32, diameter: this.config.diameter },
      this.game.scene
    )

    const material = new B.StandardMaterial("planet", this.game.scene)

    material.diffuseColor = B.Color3.FromHexString(this.config.color)
    material.alpha = 1
    material.specularPower = 100
    // material.useLogarithmicDepth = true
    this.model.material = material

    // Enable physics for the planet mesh
    this.enablePhysics()
  }

  enablePhysics() {
    if (this.model) {
      // Create a physics impostor for the planet mesh
      this.model.physicsImpostor = new B.PhysicsImpostor(
        this.model,
        B.PhysicsImpostor.SphereImpostor, // Use SphereImpostor for spheres
        { mass: 0, restitution: 0.9 },
        this.game.scene
      )
    } else {
      console.error("Failed to enable physics. Planet model is missing.")
    }
  }
}
