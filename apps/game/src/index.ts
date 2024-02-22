import * as B from "@babylonjs/core/Legacy/legacy"
import { GridMaterial } from "@babylonjs/materials"

export class Game {
  canvas: HTMLCanvasElement

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas
    const engine = new B.Engine(canvas)

    // Create our first scene.
    var scene = new B.Scene(engine)

    // This creates and positions a free camera (non-mesh)
    var camera = new B.FreeCamera("camera1", new B.Vector3(0, 5, -10), scene)

    // This targets the camera to scene origin
    camera.setTarget(B.Vector3.Zero())

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true)

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new B.HemisphericLight("light1", new B.Vector3(0, 1, 0), scene)

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7

    // Create a grid material
    var material = new GridMaterial("grid", scene)

    // Our built-in 'sphere' shape.
    var sphere = B.CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene)

    // Move the sphere upward 1/2 its height
    sphere.position.y = 2

    // Affect a material
    sphere.material = material

    // Our built-in 'ground' shape.
    var ground = B.CreateGround(
      "ground1",
      { width: 6, height: 6, subdivisions: 2 },
      scene
    )

    // Affect a material
    ground.material = material

    // Render every frame
    engine.runRenderLoop(() => {
      scene.render()
    })
  }
}
