import { B, GUI } from "~/b"
import { Game } from ".."
import { PowerStation } from "~/units/buildings/power-station"
import { BuildingConfig } from "~/data"

export type CursorMode = "select" | "power-plant" | "mine"

const buttons: {
  name: string
  mode: CursorMode
}[] = [
  {
    name: "Select",
    mode: "select",
  },
  {
    name: "Power Plant",
    mode: "power-plant",
  },
  {
    name: "Mine",
    mode: "mine",
  },
]

export class GameGUI {
  game: Game
  panel: GUI.StackPanel
  cursorMode: CursorMode = "select"

  constructor({ game }: { game: Game }) {
    this.game = game
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")

    const panel = new GUI.StackPanel()
    panel.width = "220px"
    advancedTexture.addControl(panel)
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    this.panel = panel

    this.populateButtons()
    this.registerEvents()
  }

  registerEvents = () => {
    const game = this.game
    window.addEventListener("click", (_evt) => {
      // Use scene's pointerX and pointerY to compute picking
      var pickResult = game.scene.pick(game.scene.pointerX, game.scene.pointerY)

      if (pickResult.hit) {
        // If the ground was clicked, create a sphere at the location
        // const sphere = B.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, game.scene)
        // sphere.position = pickResult.pickedPoint

        const pickedPoint = pickResult.pickedPoint

        if (this.cursorMode === "select" && pickedPoint) {
          const continent = game.units.find((c) => c.type === "continent")

          if (!continent?.model) return

          // Get the world matrix of the box
          var worldMatrix = continent.model.getWorldMatrix()

          // Invert the world matrix to get the transformation matrix for converting world to local coordinates
          var invertWorldMatrix = worldMatrix.invert()

          // Transform the picked point to the box's local coordinates
          var localPoint = B.Vector3.TransformCoordinates(pickedPoint, invertWorldMatrix)
          localPoint.z -= continent.config.depth / 2

          if (localPoint.z < 0) return

          const config: BuildingConfig = {
            id: game.units.length,
            continentId: continent.config.id,
            name: "Power Plant",
            playerId: game.players[0].config.id,
            type: "power-station",
            position: new B.Vector2(localPoint.x, localPoint.y),
          }

          const newBuilding = new PowerStation({
            game: this.game,
            config,
          })
          this.game.units.push(newBuilding)
        }
      }
    })
  }

  populateButtons = () => {
    buttons.forEach((button) => {
      const buttonControl = GUI.Button.CreateSimpleButton("but", button.name)
      buttonControl.height = "40px"
      buttonControl.color = "white"
      buttonControl.background = "green"
      this.panel.addControl(buttonControl)
      buttonControl.onPointerUpObservable.add(() => {
        this.cursorMode = button.mode
      })
    })
  }
}
