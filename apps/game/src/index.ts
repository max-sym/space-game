import { B } from "~/b"
import { GameConfig, data } from "~/data"
import { Planet } from "./planet"
import { Unit } from "./unit"
import { Grid } from "./grid"

export class Game {
  canvas: HTMLCanvasElement
  scene: B.Scene
  camera: B.ArcRotateCamera
  config: GameConfig = data
  engine: B.Engine
  units: Unit[] = []

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas
    this.engine = new B.Engine(canvas, false)
    this.scene = new B.Scene(this.engine)

    this.init()
  }

  init = () => {
    this.populatePlanets()
    this.initCamera()
    this.initEnv()
    this.engine.runRenderLoop(() => {
      this.update()
      this.scene.render()
    })
  }

  update = () => {
    this.units.forEach((unit) => {
      unit.update()
    })
  }

  initCamera = () => {
    this.camera = new B.ArcRotateCamera(
      "main-camera",
      3.5,
      1.3,
      1,
      // this.config.camera.target.position,
      this.units[0].continents[0].position,
      this.scene
    )
    this.camera.fov = 0.5
    this.camera.minZ = 0.001
    this.camera.attachControl(this.canvas, true)
  }

  initEnv = () => {
    var light = new B.PointLight("light1", new B.Vector3(0, 0, 0), this.scene)

    light.intensity = 0.7

    if (this.config.showGrid) {
      new Grid({ game: this })
    }
  }

  populatePlanets = () => {
    this.units = this.config.planets.map(
      (planet) => new Planet({ game: this, config: planet })
    )
  }
}
