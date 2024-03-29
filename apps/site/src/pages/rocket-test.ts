const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180
const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI

type Vector = {
  x: number
  y: number
}

type UnitConfig = {
  position: Vector
  /**
   * Rotation in degrees
   */
  rotation: number
  width: number
  height: number
  color: string
}

type RocketConfig = UnitConfig

type ContinentConfig = UnitConfig

class Unit {
  position: Vector
  rotation: number
  width: number
  height: number
  color: string
  game: Game
  bounds: Bounds = {
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: 0 },
    pointC: { x: 0, y: 0 },
    pointD: { x: 0, y: 0 },
  }

  constructor(config: UnitConfig, game: Game) {
    this.position = config.position
    this.rotation = config.rotation
    this.height = config.height
    this.width = config.width
    this.color = config.color
    this.game = game
  }

  draw() {
    this.game.ctx.fillStyle = this.color
    this.game.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height)
  }

  defineBounds() {
    const rotationInRadians = degreesToRadians(this.rotation)
    const halfWidth = this.width / 2
    const halfHeight = this.height / 2
    const cosRotation = Math.cos(rotationInRadians)
    const sinRotation = Math.sin(rotationInRadians)

    this.bounds = {
      pointA: {
        x: this.position.x - halfWidth * cosRotation + halfHeight * sinRotation,
        y: this.position.y - halfWidth * sinRotation - halfHeight * cosRotation,
      },
      pointB: {
        x: this.position.x + halfWidth * cosRotation + halfHeight * sinRotation,
        y: this.position.y + halfWidth * sinRotation - halfHeight * cosRotation,
      },
      pointC: {
        x: this.position.x - halfWidth * cosRotation - halfHeight * sinRotation,
        y: this.position.y - halfWidth * sinRotation + halfHeight * cosRotation,
      },
      pointD: {
        x: this.position.x + halfWidth * cosRotation - halfHeight * sinRotation,
        y: this.position.y + halfWidth * sinRotation + halfHeight * cosRotation,
      },
    }
  }

  drawBounds() {
    this.game.ctx.fillStyle = "#ff0000"
    this.game.ctx.fillRect(this.bounds.pointA.x - 1, this.bounds.pointA.y - 1, 2, 2)
    this.game.ctx.fillRect(this.bounds.pointB.x - 1, this.bounds.pointB.y - 1, 2, 2)
    this.game.ctx.fillRect(this.bounds.pointC.x - 1, this.bounds.pointC.y - 1, 2, 2)
    this.game.ctx.fillRect(this.bounds.pointD.x - 1, this.bounds.pointD.y - 1, 2, 2)
  }

  update() {
    this.game.ctx.translate(this.position.x, this.position.y)

    this.game.ctx.rotate(degreesToRadians(this.rotation))

    this.draw()

    this.game.ctx.setTransform(1, 0, 0, 1, 0, 0)

    this.defineBounds()
    this.drawBounds()
  }
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  // Lines are parallel
  if (denominator === 0) {
    return false
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1)
  let y = y1 + ua * (y2 - y1)

  return { x, y }
}

type Bounds = {
  pointA: Vector
  pointB: Vector
  pointC: Vector
  pointD: Vector
}

class Rocket extends Unit {
  gravity = 1
  stopped = false

  constructor(config: RocketConfig, game: Game) {
    super(config, game)
  }

  drawCircle() {
    this.game.ctx.beginPath()
    this.game.ctx.arc(0, -this.height / 2, this.width / 2, 0, Math.PI * 2)
    this.game.ctx.closePath()
    this.game.ctx.fill()
  }

  applyGravity() {
    if (!this.stopped) {
      const rotationInRadians = degreesToRadians(this.rotation)

      const gravityY = this.gravity * Math.cos(rotationInRadians)
      const gravityX = this.gravity * Math.sin(-rotationInRadians)

      this.position.x -= gravityX
      this.position.y -= gravityY
    }
  }

  checkCollisionWithContinent(continent: Continent) {
    if (!this.stopped) {
      const rocketEdges = [
        [this.bounds.pointA, this.bounds.pointB],
        [this.bounds.pointB, this.bounds.pointD],
        [this.bounds.pointC, this.bounds.pointD],
        [this.bounds.pointC, this.bounds.pointA],
      ]

      const continentEdges = [
        [continent.bounds.pointA, continent.bounds.pointB],
        [continent.bounds.pointB, continent.bounds.pointD],
        [continent.bounds.pointC, continent.bounds.pointD],
        [continent.bounds.pointC, continent.bounds.pointA],
      ]

      let hasCollision = false

      for (let i = 0; i < rocketEdges.length; i++) {
        const rocketEdge = rocketEdges[i]

        for (let j = 0; j < continentEdges.length; j++) {
          const continentEdge = continentEdges[j]

          if (
            intersect(
              rocketEdge[0].x,
              rocketEdge[0].y,
              rocketEdge[1].x,
              rocketEdge[1].y,
              continentEdge[0].x,
              continentEdge[0].y,
              continentEdge[1].x,
              continentEdge[1].y
            )
          ) {
            hasCollision = true
            break
          }
        }

        if (hasCollision) {
          break
        }
      }

      if (hasCollision) {
        this.stopped = true
      }
    }
  }

  draw() {
    super.draw()
    this.drawCircle()
  }

  update() {
    super.update()

    this.applyGravity()

    this.game.units
      .filter((unit) => unit instanceof Continent)
      .forEach((continent: Continent) => {
        this.checkCollisionWithContinent(continent)
      })
  }
}

class Continent extends Unit {
  constructor(config: ContinentConfig, game: Game) {
    super(config, game)
  }
}

type DataType = {
  rockets: RocketConfig[]
  continents: ContinentConfig[]
}

const data: DataType = {
  rockets: [
    {
      position: { x: 0, y: 500 },
      rotation: 90,
      width: 30,
      height: 150,
      color: "#fb0",
    },
  ],
  continents: [
    {
      position: { x: 860, y: 600 },
      rotation: 270,
      width: 500,
      height: 100,
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
    data.continents.forEach((continentConfig) => {
      this.units.push(new Continent(continentConfig, this))
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
