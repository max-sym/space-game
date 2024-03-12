import { B, GUI } from "~/b"
import { Game } from ".."
import { PowerStation } from "~/units/buildings/power-station"
import { Mine } from "~/units/buildings/mine"
import { BuildingConfig } from "~/data"
import { Player } from "~/player"

export type CursorMode = "select" | "power-plant" | "mine"

const buttons: { name: string; mode: CursorMode }[] = [
  { name: "Select", mode: "select" },
  { name: "Power Plant", mode: "power-plant" },
  { name: "Mine", mode: "mine" },
]

export class GameGUI {
  game: Game
  panel: GUI.StackPanel
  cursorMode: CursorMode = "select"
  header: GUI.TextBlock | null = null
  player: Player

  constructor({ game }: { game: Game }) {
    this.game = game
    this.player = this.game.players[0]

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
    const rootPanel = new GUI.StackPanel()
    rootPanel.width = "100%"
    advancedTexture.addControl(rootPanel)

    this.populateHeader(rootPanel)

    const panel = new GUI.StackPanel()
    panel.width = "220px"
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    rootPanel.addControl(panel)
    this.panel = panel

    this.populateButtons()
    this.registerEvents()
  }

  updateHeader() {
    if (this.header) {
      const resources = this.player.state.resources
      const headerText = Object.entries(resources)
        .map(
          ([resourceName, amount]) =>
            `${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}: ${amount}`
        )
        .join(" | ")
      this.header.text = headerText
    }
  }

  registerEvents = () => {
    const game = this.game
    window.addEventListener("click", (_evt) => {
      var pickResult = game.scene.pick(game.scene.pointerX, game.scene.pointerY)

      if (pickResult.hit) {
        const pickedPoint = pickResult.pickedPoint

        if (this.cursorMode === "select" && pickedPoint) {
          const continent = game.units.find((c) => c.type === "continent")

          if (!continent?.model) return

          var worldMatrix = continent.model.getWorldMatrix()
          var invertWorldMatrix = worldMatrix.invert()
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

  populateHeader(rootPanel: GUI.StackPanel) {
    this.header = new GUI.TextBlock("header")
    this.header.color = "white"
    this.header.fontSize = 24
    this.header.paddingTop = "10px"
    this.header.paddingBottom = "10px"
    rootPanel.addControl(this.header)

    // Add an update button
    const updateButton = GUI.Button.CreateSimpleButton("updateButton", "Update")
    updateButton.height = "40px"
    updateButton.color = "white"
    updateButton.background = "blue"
    rootPanel.addControl(updateButton)

    // Register event handler for the update button
    updateButton.onPointerUpObservable.add(() => {
      this.updateHeader()
    })
  }
}
