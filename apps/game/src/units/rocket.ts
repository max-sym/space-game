import { B } from "~/b"
import { Unit } from "./unit"
import { RocketConfig } from "~/data"
import { Game } from "~/index"

const calculateGravityForce = (
  rocketMass: number,
  planetMass: number,
  distance: number
) => {
  const exp = -6
  const G = 6.674 * Math.pow(10, exp)
  const force = (G * rocketMass * planetMass) / Math.pow(distance, 2)
  return force
}

export class Orbit extends Unit {
  points: B.Vector3[] = []

  constructor({ game, points }: { game: Game; points: B.Vector3[] }) {
    super({ game })
    this.points = points
    this.model = B.CreateLines("orbit", { points: this.points }, this.game.scene)
  }
  addPoint(point: B.Vector3) {
    this.points.push(point)
    this.model = B.CreateLines("orbit", { points: this.points }, this.game.scene)
  }
}

export class Rocket extends Unit {
  config: RocketConfig
  gravityForce: number
  orbit: Orbit

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
    this.orbit = new Orbit({ game, points: [this.position] })
  }

  gravitateToPlanet() {
    const planet = this.game.units.find((u) => u.type === "planet")
    if (!planet) return
    const distanceToPlanet = B.Vector3.Distance(planet.position, this.position)
    this.gravityForce =
      calculateGravityForce(this.config.mass, planet.config.mass, distanceToPlanet) * 1.3
    const gravityDirection = planet.position.subtract(this.position).normalize()
    this.config.state.velocity
      .addInPlace(gravityDirection.scale(this.gravityForce * 0.8))
      .normalize()
  }

  move() {
    this.position = this.position.add(
      this.config.state.velocity
        .clone()
        .scale((this.config.state.speed + this.gravityForce * 4) * 2.5)
    )
  }
  update() {
    super.update()
    if (this.game.frame % 30 === 0) {
      this.orbit.addPoint(this.position)
    }
    this.gravitateToPlanet()
    this.move()
  }
}
