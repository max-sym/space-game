import { Continent } from "~/units/continent"
import { BuildingConfig } from "~/data"
import { ModelType } from "~/data/buildings"
import { Unit } from "~/units/unit"
import { Game } from "../.."
import { B } from "~/b"

export class Building<T extends ModelType> extends Unit {
  continent: Continent
  config: BuildingConfig
  buildingModel: T

  constructor({
    continent,
    config,
    game,
    buildingModel,
  }: {
    continent: Continent
    config: BuildingConfig
    game: Game
    buildingModel: ModelType
  }) {
    super({ game })
    this.continent = continent
    this.buildingModel = buildingModel
    this.config = config
    this.model = B.CreateBox(
      config.name,
      {
        depth: this.buildingModel.model.height,
        height: this.buildingModel.model.length,
        width: this.buildingModel.model.width,
      },
      this.game.scene
    )

    const material = new B.StandardMaterial("building", this.game.scene)
    material.diffuseColor = B.Color3.FromHexString(this.buildingModel.model.color)
    this.model.material = material

    this.position = this.continent.position.clone()
    this.rotation = this.continent.rotation.clone()

    const rotationVector = this.rotation

    let quaternion = B.Quaternion.RotationYawPitchRoll(
      rotationVector.y,
      rotationVector.x,
      rotationVector.z
    )

    // Create a rotation matrix from the quaternion
    let rotationMatrix = new B.Matrix()
    quaternion.toRotationMatrix(rotationMatrix)

    // Default forward vector
    const forward = new B.Vector3(0, 0, 1)
    const up = new B.Vector3(0, 1, 0)
    const right = new B.Vector3(1, 0, 0)

    // Apply the rotation to the forward vector
    let direction = B.Vector3.TransformNormal(forward, rotationMatrix)
    let directionRight = B.Vector3.TransformNormal(right, rotationMatrix)
    let directionUp = B.Vector3.TransformNormal(up, rotationMatrix)

    const offset = this.continent.config.depth / 2 + this.buildingModel.model.height / 2

    // Normalize and scale the direction vector
    direction.normalize().scaleInPlace(offset)
    directionRight.normalize().scaleInPlace(this.config.position.x)
    directionUp.normalize().scaleInPlace(this.config.position.y)

    // Move the object
    this.position.addInPlace(direction)
    this.position.addInPlace(directionRight)
    this.position.addInPlace(directionUp)
  }
}
