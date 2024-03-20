type Vector = {
  x: number
  y: number
}

type UnitConfig = {
  position: Vector
  width: number
  height: number
  color: string
}

type RocketConfig = UnitConfig

type ContinentConfig = UnitConfig

class Unit {
  position: Vector
  width: number
  height: number
  color: string
  game: Game

  constructor(config: UnitConfig, game: Game) {
    this.position = config.position
    this.height = config.height
    this.width = config.width
    this.color = config.color
    this.game = game
  }

  update() {
    this.game.ctx.fillStyle = this.color
    this.game.ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

class Rocket extends Unit {
  gravity = 1

  constructor(config: RocketConfig, game: Game) {
    super(config, game)
  }

  drawCircle() {
    this.game.ctx.beginPath()
    this.game.ctx.arc(
      this.position.x + this.width / 2,
      this.position.y,
      this.width / 2,
      0,
      Math.PI * 2
    )
    this.game.ctx.closePath()
    this.game.ctx.fill()
  }

  applyGravity() {
    this.position.y += this.gravity
  }

  update() {
    super.update()
    this.drawCircle()
    this.applyGravity()
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
      position: { x: 450, y: 200 },
      width: 30,
      height: 150,
      color: "#fb0",
    },
  ],
  continents: [
    {
      position: { x: 240, y: 500 },
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
