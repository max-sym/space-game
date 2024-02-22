import { B } from "~/b"
import { GameConfig, data } from "~/data"
import { Planet } from "./planet"

export class Game {
  canvas: HTMLCanvasElement
  scene: B.Scene
  camera: B.FreeCamera
  config: GameConfig = data

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas
    const engine = new B.Engine(canvas)

    this.scene = new B.Scene(engine)

    this.camera = new B.FreeCamera(
      "camera1",
      new B.Vector3(0, 5, -10),
      this.scene
    )

    this.camera.setTarget(B.Vector3.Zero())

    this.camera.attachControl(canvas, true)

    var light = new B.HemisphericLight(
      "light1",
      new B.Vector3(0, 1, 0),
      this.scene
    )

    light.intensity = 0.7

    this.config.planets.forEach((planet) => {
      new Planet({ game: this, config: planet })
    })

    engine.runRenderLoop(() => {
      this.scene.render()
    })
  }
}
