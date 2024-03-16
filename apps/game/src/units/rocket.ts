import { B } from "~/b"
import { Unit } from "./unit"
import { RocketConfig } from "~/data"
import { Game } from "~/index"

const calculateGravityForce = (
  rocketMass: number,
  planetMass: number,
  distance: number
) => {
  const exp = -5
  const G = 6.674 * Math.pow(10, exp)
  const force = (G * rocketMass * planetMass) / Math.pow(distance, 2)
  return force
}

export class Rocket extends Unit {
  config: RocketConfig

  constructor({ game, config }: { game: Game; config: RocketConfig }) {
    super({ game })
    this.config = config
    this.position = this.config.position.clone()
    this.rotation = this.config.rotation.clone()

    this.model = B.CreateBox(
      this.config.name,
      {
        height: this.config.dimentions.height,
        depth: this.config.dimentions.length,
        width: this.config.dimentions.width,
      },
      this.game.scene
    )

    const material = new B.StandardMaterial("rocket", this.game.scene)
    material.diffuseColor = B.Color3.FromHexString(this.config.color)
    material.alpha = 1
    material.specularPower = 100
    this.model.material = material
  }

  gravitateToPlanet() {
    const planet = this.game.units.find((u) => u.type === "planet")
    if (!planet) return
    const distanceToPlanet = B.Vector3.Distance(planet.position, this.position)
    const gravityForce = calculateGravityForce(
      this.config.mass,
      planet.config.mass,
      distanceToPlanet
    )
    const direction = planet.position.subtract(this.position).normalize()
    this.position = this.position.add(direction.scale(gravityForce))
  }
  move() {
    this.position = this.position.add(
      this.config.state.velocity.clone().scale(this.config.state.speed)
    )
  }
  update() {
    super.update()
    this.gravitateToPlanet()
    this.move()
  }
}
