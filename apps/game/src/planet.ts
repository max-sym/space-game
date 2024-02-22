// import { StandardMaterial } from "@babylonjs/materials"
import { B } from "~/b"
import { ContinentConfig, PlanetConfig } from "~/data"
import { Game } from "."

export class Unit {
  model: B.Mesh | null = null
  game: Game
  position: B.Vector3 = B.Vector3.Zero()
  rotation: B.Vector3 = B.Vector3.Zero()

  constructor({ game }: { game: Game }) {
    this.game = game
  }

  update = () => {
    if (this.model) {
      this.model.position = this.position
    }
  }
}

export class Continent extends Unit {
  planet: Planet
  constructor({ planet, config }: { planet: Planet; config: ContinentConfig }) {
    super({ game: planet.game })
    this.planet = planet
    this.model = B.CreateBox(
      config.name,
      { size: config.size },
      this.game.scene
    )

    const material = new B.StandardMaterial("continent", this.game.scene)
    material.diffuseColor = B.Color3.FromHexString("#00ff00")
  }
}

export class Planet extends Unit {
  config: PlanetConfig = {
    name: "",
    diameter: 1,
    position: new B.Vector3(0, 0, 0),
    continents: [],
    color: "blue",
  }

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
    material.specularPower = 100
    this.model.material = material

    this.createContinents()
  }

  createContinents = () => {
    this.config.continents.forEach((continent) => {
      new Continent({ planet: this, config: continent })
    })
  }
}
