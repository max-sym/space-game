import { SimpleMaterial } from "@babylonjs/materials"
import { B } from "~/b"
import { PlanetConfig } from "~/data"

export class Planet {
  model: B.Mesh
  game: Game
  position: B.Vector3
  config: PlanetConfig = {
    name: "",
    diameter: 1,
    position: new B.Vector3(0, 0, 0),
  }

  constructor({ game, config }: { game: Game; config: PlanetConfig }) {
    this.game = game
    this.config = config
    this.position = this.config.position

    this.model = B.CreateSphere(
      this.config.name,
      { segments: 32, diameter: this.config.diameter },
      this.game.scene
    )

    this.model.position = this.position
    this.model.material = new SimpleMaterial("planet", this.game.scene)
  }
}

export class Game {
  canvas: HTMLCanvasElement
  scene: B.Scene
  camera: B.FreeCamera

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

    const planets: PlanetConfig[] = [
      {
        name: "earth",
        diameter: 1,
        position: new B.Vector3(0, 0, 0),
      },
      {
        name: "mars",
        diameter: 2,
        position: new B.Vector3(0, 0, 2),
      },
    ]

    planets.forEach((planet) => {
      new Planet({ game: this, config: planet })
    })

    engine.runRenderLoop(() => {
      this.scene.render()
    })
  }
}
