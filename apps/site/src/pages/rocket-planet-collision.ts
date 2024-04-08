const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180
const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI

type Vector = {
  x: number
  y: number
}

type UnitConfig = {
  position: Vector
  rotation: number
  radius: number
  color: string
}

type RocketConfig = UnitConfig

type PlanetConfig = UnitConfig

class Unit {
  position: Vector
  rotation: number
  radius: number
  color: string
  game: Game

  constructor(config: UnitConfig, game: Game) {
    this.position = config.position
    this.rotation = config.rotation
    this.radius = config.radius
    this.color = config.color
    this.game = game
  }

  draw() {
    this.game.ctx.fillStyle = this.color
    this.game.ctx.beginPath()
    this.game.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) // draw circle (x, and y position from center, get angle (0) and math.pi * 2 = 180 * 2)
    this.game.ctx.closePath()
    this.game.ctx.fill()
  }

  update() {
    this.draw()
  }
}

class Rocket extends Unit {
  gravity = 1
  stopped = false

  constructor(config: RocketConfig, game: Game) {
    super(config, game)
  }

  applyGravity() {
    if (!this.stopped) {
      const rotationInRadians = degreesToRadians(this.rotation)
      const gravityY = this.gravity * Math.cos(rotationInRadians)
      const gravityX = this.gravity * Math.sin(-rotationInRadians)

      this.position.x -= gravityX
      this.position.y -= gravityY

      this.resolveCollisionWithPlanet()
    }
  }

  resolveCollisionWithPlanet() {
    const planet = this.game.units.find((unit) => unit instanceof Planet)
    if (planet) {
      const dx = this.position.x - planet.position.x // horizontal distance between rocket and planet position
      const dy = this.position.y - planet.position.y // vertical distance between rocket and planet position
      const distance = Math.sqrt(dx * dx + dy * dy) // teorema de pitagoras/ square root of dx and dy
      const minDistance = this.radius + planet.radius // min distance of overlap = rocket radius + planet radius

      if (distance < minDistance) {
        // if the distance is less than minimum distance, there's a collision
        this.stopped = true

        // Resolve overlap
        const overlap = minDistance - distance // if the value is positive = overlap
        const overlapX = (dx / distance) * overlap // horizontal overlap
        const overlapY = (dy / distance) * overlap // vertical overlap

        // Adjust position to resolve overlap
        this.position.x += overlapX // moves horizontaly so it doesn't overlap
        this.position.y += overlapY // moves vertically so it doesn't overlap
      }
    }
  }

  update() {
    super.update()
    this.applyGravity()
  }
}

class Planet extends Unit {
  constructor(config: PlanetConfig, game: Game) {
    super(config, game)
  }
}

type DataType = {
  rockets: RocketConfig[]
  planets: PlanetConfig[]
}

const data: DataType = {
  rockets: [
    {
      position: { x: 0, y: 500 },
      rotation: 90,
      radius: 5,
      color: "#fb0",
    },
  ],
  planets: [
    {
      position: { x: 860, y: 486 },
      rotation: 270,
      radius: 10,
      color: "#3f3",
    },
  ],
}

export class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  units: Unit[] = []

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D

    this.renderLoop = this.renderLoop.bind(this)

    this.populateUnits()
    this.renderLoop()
  }

  populateUnits() {
    data.planets.forEach((planetConfig) => {
      this.units.push(new Planet(planetConfig, this))
    })
    data.rockets.forEach((rocketConfig) => {
      this.units.push(new Rocket(rocketConfig, this))
    })
  }

  update() {
    this.ctx.fillStyle = "black"
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fill()

    this.units.forEach((unit) => {
      unit.update()
    })
  }

  renderLoop() {
    window.requestAnimationFrame(this.renderLoop)
    this.update()
  }
}
