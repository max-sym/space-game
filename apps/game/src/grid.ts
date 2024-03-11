import { B } from "~/b"
import { Unit } from "./unit"
import { Game } from "."

export class Grid extends Unit {
  constructor({ game }: { game: Game }) {
    super({ game })
    // Parameters
    var gridSize = 3000 // Size of the grid
    var gridLines = 30 // Number of lines in the grid
    var step = gridSize / gridLines // Distance between lines

    const greenColor = new B.Color4(0, 1, 0, 0.25) // RGBA for green

    // Create grid lines parallel to X-axis
    for (let i = -gridSize / 2; i <= gridSize / 2; i += step) {
      B.MeshBuilder.CreateLines(
        "gridLine",
        {
          points: [new B.Vector3(-gridSize / 2, 0, i), new B.Vector3(gridSize / 2, 0, i)],
          colors: [greenColor, greenColor],
        },
        this.game.scene
      )
    }

    // Create grid lines parallel to Z-axis
    for (let i = -gridSize / 2; i <= gridSize / 2; i += step) {
      B.MeshBuilder.CreateLines(
        "gridLine",
        {
          points: [new B.Vector3(i, 0, -gridSize / 2), new B.Vector3(i, 0, gridSize / 2)],
          colors: [greenColor, greenColor],
        },
        this.game.scene
      )
    }
  }
}
