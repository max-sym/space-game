import { B } from "~/b"
import { GameConfig, data } from "~/data"
import { Planet } from "./planet"

export class Game {
  canvas: HTMLCanvasElement
  scene: B.Scene
  camera: B.FreeCamera
  config: GameConfig = data
  engine: B.Engine

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas
    this.engine = new B.Engine(canvas)
    this.scene = new B.Scene(this.engine)

    this.init()
  }

  init = () => {
    this.populatePlanets()
    this.initCamera()
    this.initEnv()
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  initCamera = () => {
    this.camera = new B.FreeCamera(
      "main-camera",
      this.config.camera.position,
      this.scene
    )
    this.camera.setTarget(this.config.camera.target)
    this.camera.attachControl(this.canvas, true)
  }

  initEnv = () => {
    var light = new B.HemisphericLight(
      "light1",
      new B.Vector3(0, 1, 0),
      this.scene
    )

    light.intensity = 0.7
  }

  populatePlanets = () => {
    this.config.planets.forEach((planet) => {
      new Planet({ game: this, config: planet })
    })
  }
}
