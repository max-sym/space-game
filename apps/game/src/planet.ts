import { SimpleMaterial } from "@babylonjs/materials"
import { B } from "~/b"
import { PlanetConfig } from "~/data"
import { Game } from "."

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
