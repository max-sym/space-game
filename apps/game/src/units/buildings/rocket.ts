import { B } from "~/b"
import { Unit } from "../unit"
import { RocketConfig } from "~/data"
import { Game } from "~/index"

export class Rocket extends Unit {
  config: RocketConfig

  constructor({ game, config }: { game: Game; config: RocketConfig }) {
    super({ game })
    this.config = config
    this.position = this.config.position.clone()

    this.model = B.CreateBox(
      this.config.name,
      {
        height: this.config.dimentions.height,
        depth: this.config.dimentions.length,
        width: this.config.dimentions.width,
      },
      this.game.scene
    )

    const material = new B.StandardMaterial("rocket", this.game.scene)
    material.diffuseColor = B.Color3.FromHexString(this.config.color)
    material.alpha = 1
    material.specularPower = 100
    this.model.material = material
  }
}
