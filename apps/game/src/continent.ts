import { B } from "~/b"
import { ContinentConfig, buildingClasses } from "~/data"
import { Planet } from "./planet"
import { Unit } from "./unit"
import { Building } from "./buildings/building"
import { sphericalPosition, rotateTowardsCenter } from "./utils"

export class Continent extends Unit {
  planet: Planet
  config: ContinentConfig
  buildings: Building[] = []

  constructor({ planet, config }: { planet: Planet; config: ContinentConfig }) {
    super({ game: planet.game })
    this.planet = planet
    this.config = config
    this.model = B.CreateBox(
      config.name,
      {
        depth: config.depth,
        height: config.size,
        width: config.size,
      },
      this.game.scene
    )

    const material = new B.StandardMaterial("continent", this.game.scene)
    material.diffuseColor = B.Color3.FromHexString("#00ff00")
    material.alpha = 1
    // material.useLogarithmicDepth = true
    this.model.material = material

    this.position = this.planet.position.clone()
    const offset = sphericalPosition(
      new B.Vector3(),
      this.planet.config.diameter / 2 - config.offset,
      config.position.x * 360,
      config.position.y * 360
    )

    this.position = this.position.add(offset)
    this.rotation = rotateTowardsCenter(this.planet.position, this.position)
    this.populateBuildings()
  }

  populateBuildings() {
    this.config.buildings.forEach((buildingConfig) => {
      const buildingClass = buildingClasses[buildingConfig.type]
      const building = new buildingClass({
        continent: this,
        config: buildingConfig,
        game: this.game,
      })
      this.buildings.push(building)
    })
  }

  update() {
    super.update()
    this.buildings.forEach((building) => building.update())
  }
}
