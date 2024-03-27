import { B } from "~/b"
import { Game } from ".."
import { UnitType } from "~/data"

export class Unit {
  type: UnitType
  model: B.Mesh | null = null
  game: Game
  selectedMesh: B.Mesh | null = null
  position: B.Vector3 = B.Vector3.Zero()
  rotation: B.Vector3 = B.Vector3.Zero()

  constructor({ game, type }: { game: Game; type: UnitType }) {
    this.game = game
    this.type = type
  }

  select() {
    this.selectedMesh = this.model?.clone() as B.Mesh

    const material = new B.StandardMaterial("selected", this.game.scene)

    material.diffuseColor = B.Color3.Yellow()
    material.emissiveColor = B.Color3.Yellow()
    material.alpha = 0.1
    this.selectedMesh.scaling = B.Vector3.One().scale(1.05)
    this.selectedMesh.material = material
    this.game.scene.addMesh(this.selectedMesh)
  }

  deselect() {
    this.selectedMesh?.dispose()
    this.selectedMesh = null
  }

  update() {
    if (this.model) {
      this.model.position = this.position
      this.model.rotation = this.rotation
    }
  }
}
