import { B } from "~/b"
import { Game } from ".."

export class Unit {
  model: B.Mesh | null = null
  game: Game
  position: B.Vector3 = B.Vector3.Zero()
  rotation: B.Vector3 = B.Vector3.Zero()

  constructor({ game }: { game: Game }) {
    this.game = game
  }

  update() {
    if (this.model) {
      this.model.position = this.position
      this.model.rotation = this.rotation
    }
  }
}
