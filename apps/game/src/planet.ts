import { B } from "~/b"
import { PlanetConfig } from "~/data"
import { Game } from "."
import { Continent } from "./continent"
import { Unit } from "./unit"

export class Planet extends Unit {
  config: PlanetConfig = {
    name: "",
    diameter: 1,
    position: new B.Vector3(0, 0, 0),
    continents: [],
    color: "blue",
  }
  continents: Continent[] = []

  constructor({ game, config }: { game: Game; config: PlanetConfig }) {
    super({ game })
    this.config = config
    this.position = this.config.position.clone()

    this.model = B.CreateSphere(
      this.config.name,
      { segments: 32, diameter: this.config.diameter },
      this.game.scene
    )

    const material = new B.StandardMaterial("planet", this.game.scene)

    material.diffuseColor = B.Color3.FromHexString(this.config.color)
    material.alpha = 1
    material.specularPower = 100
    // material.useLogarithmicDepth = true
    this.model.material = material

    this.createContinents()
  }

  update() {
    super.update()
    this.continents.forEach((continent) => {
      continent.update()
    })
  }

  createContinents = () => {
    this.config.continents.forEach((continent) => {
      this.continents.push(new Continent({ planet: this, config: continent }))
    })
  }
}
