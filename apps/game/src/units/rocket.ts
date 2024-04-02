import { B } from "~/b"
import { Unit } from "./unit"
import { RocketConfig, scale } from "~/data"
import { Game } from "~/index"
import { Planet } from "./planet"

const G = 6.6743e-11 // Universal gravitational constant in m^3 kg^-1 s^-2

// Function to calculate gravitational force
const calculateGravityForce = (m1: number, m2: number, r: number) => {
  return (G * (m1 * m2)) / r ** 2
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
    if (this.points.length > 100) {
      this.points.shift()
    }
    this.model = B.CreateLines("orbit", { points: this.points }, this.game.scene)
  }
}

export enum TurnDirection {
  NONE,
  LEFT,
  RIGHT,
}

type InstructionType = {
  time: number
  duration: number
  acceleration: number
  turn: TurnDirection
  executed?: boolean
}

export class Program {
  instructions: InstructionType[] = []

  constructor({ game, rocket }: { game: Game; rocket: Rocket }) {
    this.instructions = [
      { time: 10, duration: 3, acceleration: 0, turn: TurnDirection.LEFT },
      { time: 30, duration: 4, acceleration: 0.2, turn: TurnDirection.RIGHT },
      { time: 40, duration: 100, acceleration: 0.01, turn: TurnDirection.LEFT },
      { time: 50, duration: 7, acceleration: 0.01, turn: TurnDirection.LEFT },
    ]

    console.log(this.instructions)
  }

  getCurrentInstruction(currentTimeSeconds: number): InstructionType | undefined {
    return this.instructions.find(
      (instruction) => currentTimeSeconds >= instruction.time && !instruction.executed
    )
  }
}

export class Rocket extends Unit {
  config: RocketConfig
  gravityForce: number
  orbit: Orbit
  disableGravity: boolean
  program: Program

  constructor({ game, config }: { game: Game; config: RocketConfig }) {
    super({ game, type: "rocket" })
    this.config = config
    this.position = this.config.position.clone()
    this.rotation = this.config.rotation.clone()

    this.program = new Program({ game, rocket: this })

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
    this.disableGravity = false
  }

  onKeydown() {
    if (!this.config.controlable) return

    if (this.game.inputMap["w"] || this.game.inputMap["W"]) {
      this.disableGravity = false
      const forwardVector = new B.Vector3(0, 0, 1)
      const rotationMatrix = B.Matrix.RotationYawPitchRoll(
        this.rotation.y,
        this.rotation.x,
        this.rotation.z
      )
      const velocity = 0.005
      const transformedDirection = B.Vector3.TransformNormal(
        forwardVector,
        rotationMatrix
      )

      this.config.state.velocity.addInPlace(transformedDirection.scale(velocity))
      console.log("fast")
    }
    if (this.game.inputMap["s"] || this.game.inputMap["S"]) {
      this.config.state.velocity.scaleInPlace(0.99)
      console.log("slow")
    }
    const rotationSpeed = 1.0

    if (this.game.inputMap["a"] || this.game.inputMap["A"]) {
      console.log("Strafe left")
      this.rotation.y -= rotationSpeed
    }
    if (this.game.inputMap["d"] || this.game.inputMap["D"]) {
      console.log("Strafe right")
      this.rotation.y += rotationSpeed
    }
  }

  gravitateToPlanet(planet: Planet) {
    if (!this.disableGravity) {
      // Check if gravity is disabled
      const distanceToPlanet = B.Vector3.Distance(planet.position, this.position) / scale // 50km
      this.gravityForce = calculateGravityForce(
        this.config.mass,
        planet.config.mass,
        distanceToPlanet
      )

      const gravityDirection = planet.position.subtract(this.position).normalize()
      const forceVector = gravityDirection.scale(this.gravityForce * scale)
      this.config.state.velocity.addInPlace(forceVector)
    }
  }

  move() {
    this.position = this.position.add(
      this.config.state.velocity.clone().scale(this.game.delta)
    )
  }

  gravitateToPlanets() {
    for (let i = 0; i < this.game.units.length; i++) {
      if (this.game.units[i].type === "planet") {
        this.gravitateToPlanet(this.game.units[i])
      }
    }
  }

  update() {
    for (let i = 0; i < 50; i++) {
      super.update()
      this.gravitateToPlanets()
      this.move()
    }

    this.onKeydown()

    if (this.game.frame % 30 === 0) {
      this.orbit.addPoint(this.position)
    }
    const fps = this.game.engine.getFps()
    console.log("Current FPS:", fps)

    const currentTimeSeconds = this.game.frame / fps

    for (const instruction of this.program.instructions) {
      if (currentTimeSeconds >= instruction.time && !instruction.executed) {
        console.log(`Perform action at ${currentTimeSeconds} seconds.`)
        console.log("Acceleration: ", instruction.acceleration)
        console.log("Turn: ", instruction.turn)
        const rotationSpeed = 0.02

        const forwardVector = new B.Vector3(0, 0, 1)
        const rotationMatrix = B.Matrix.RotationYawPitchRoll(
          this.rotation.y,
          this.rotation.x,
          this.rotation.z
        )
        const transformedDirection = B.Vector3.TransformNormal(
          forwardVector,
          rotationMatrix
        )

        this.config.state.velocity.addInPlace(
          transformedDirection.scale(instruction.acceleration)
        )

        switch (instruction.turn) {
          case TurnDirection.LEFT:
            console.log("Turn left")
            this.rotation.y -= rotationSpeed
            break
          case TurnDirection.RIGHT:
            console.log("Turn right")
            this.rotation.y += rotationSpeed
            break
          case TurnDirection.NONE:
            break
          default:
            console.error("Invalid turn direction")
            break
        }

        instruction.executed = true

        setTimeout(() => {
          instruction.executed = false
        }, instruction.duration * 1000)
      }
    }
  }
}
