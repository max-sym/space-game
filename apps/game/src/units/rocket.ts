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

export type InstructionType = {
  time: number
  duration: number
  acceleration: number
  turn: TurnDirection
  executed?: boolean
}

export class Program {
  instructions: InstructionType[] = []
  game: Game
  rocket: Rocket

  constructor(game: Game, rocket: Rocket) {
    this.game = game
    this.rocket = rocket

    this.instructions = [
      { time: 0, duration: 10, acceleration: 0, turn: TurnDirection.LEFT },
      { time: 30, duration: 5, acceleration: 0.5, turn: TurnDirection.RIGHT },
      { time: 35, duration: 2, acceleration: 0, turn: TurnDirection.NONE },
    ]

    console.log(this.instructions)
  }
  executeInstructions() {
    const fps = this.game.engine.getFps()
    const currentTimeSeconds = this.game.frame / fps
    let isAccelerating = false

    // Set disableGravity to false when the rocket starts moving
    // if (this.instructions.length > 0 && currentTimeSeconds >= this.instructions[0].time) {
    //   this.rocket.disableGravity = false
    // }

    // // Apply gravitational effects before executing instructions
    // for (const planet of this.game.units) {
    //   if (planet.type === "planet" && isAccelerating) {
    //     this.rocket.gravitateToPlanet(planet)
    //   }
    // }

    for (const instruction of this.instructions) {
      if (currentTimeSeconds >= instruction.time && !instruction.executed) {
        console.log(`Perform action at ${currentTimeSeconds} seconds.`)
        console.log("Acceleration: ", instruction.acceleration)
        console.log("Turn: ", instruction.turn)

        const rotationSpeed = 0.02
        let elapsedTime = 0

        // Apply acceleration for the specified duration
        const accelerationInterval = setInterval(() => {
          elapsedTime += 1 / fps
          if (elapsedTime >= instruction.duration) {
            clearInterval(accelerationInterval)
            isAccelerating = false
          } else {
            isAccelerating = true
          }

          // Apply acceleration
          const forwardVector = new B.Vector3(0, 0, 1)
          const rotationMatrix = B.Matrix.RotationYawPitchRoll(
            this.rocket.rotation.y,
            this.rocket.rotation.x,
            this.rocket.rotation.z
          )
          const transformedDirection = B.Vector3.TransformNormal(
            forwardVector,
            rotationMatrix
          )
          this.rocket.config.state.velocity.addInPlace(
            transformedDirection.scale(instruction.acceleration)
          )
        }, 1000 / fps)

        // Apply rotation for the specified duration
        const rotationInterval = setInterval(() => {
          switch (instruction.turn) {
            case TurnDirection.LEFT:
              console.log("Turn left")
              this.rocket.rotation.y -= rotationSpeed
              break
            case TurnDirection.RIGHT:
              console.log("Turn right")
              this.rocket.rotation.y += rotationSpeed
              break
            case TurnDirection.NONE:
              break
            default:
              console.error("Invalid turn direction")
              break
          }

          elapsedTime += 1 / fps
          if (elapsedTime >= instruction.duration) {
            clearInterval(rotationInterval)
          }
        }, 1000 / fps)

        instruction.executed = true
      }
    }
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

    this.program = new Program(game, this)

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
      const velocity = 0.01
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
    const rotationSpeed = 0.02

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
      this.program.executeInstructions()
    }

    this.onKeydown()

    if (this.game.frame % 30 === 0) {
      this.orbit.addPoint(this.position)
    }
  }
}
