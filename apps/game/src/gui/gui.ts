import { B, GUI } from "~/b"
import { Game } from ".."
import { PowerStation } from "~/units/buildings/power-station"
import { Mine } from "~/units/buildings/mine"
import { BuildingConfig } from "~/data"
import { Player } from "~/player"
import { Rocket } from "~/units/rocket"

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
  elements: GUI.Control[] = []
  selectedRocket: Rocket | null = null

  constructor({ game }: { game: Game }) {
    this.game = game
    this.player = this.game.players[0]

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")
    const rootPanel = new GUI.StackPanel()
    rootPanel.width = "100%"
    rootPanel.height = "50px"
    rootPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    rootPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    advancedTexture.addControl(rootPanel)

    this.populateHeader(rootPanel)

    const panel = new GUI.StackPanel()
    panel.width = "220px"
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    advancedTexture.addControl(panel)
    this.panel = panel

    this.populateButtons()
    this.registerEvents()

    // Set initial cursor mode to "select" and update button colors
    this.setCursorMode("select")
  }

  createBuildings(pickedPoint: B.Vector3) {
    const game = this.game
    const continent = this.game.units.find((c) => c.type === "continent")

    if (!continent?.model) return

    const worldMatrix = continent.model.getWorldMatrix()
    const invertWorldMatrix = worldMatrix.invert()
    const localPoint = B.Vector3.TransformCoordinates(pickedPoint, invertWorldMatrix)
    localPoint.z -= continent.config.depth / 2

    if (localPoint.z < 0) return

    const config: Omit<BuildingConfig, "name" | "type"> = {
      id: this.game.units.length,
      continentId: continent.config.id,
      playerId: game.players[0].config.id,
      position: new B.Vector2(localPoint.x, localPoint.y),
    }

    if (this.cursorMode === "power-plant") {
      const newBuilding = new PowerStation({
        game: this.game,
        config: { ...config, name: "Power Plant", type: "power-station" },
      })
      this.game.units.push(newBuilding)
    } else if (this.cursorMode === "mine") {
      const newBuilding = new Mine({
        game: this.game,
        config: { ...config, name: "Mine", type: "mine" },
      })
      this.game.units.push(newBuilding)
    }
  }

  selectRockets(pickedPoint: B.Vector3, pickResult: B.PickingInfo) {
    const rocket = this.game.units.find(
      (u) => u.type === "rocket" && u.model === pickResult.pickedMesh
    ) as Rocket | undefined

    rocket?.select()
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
      const pickResult = game.scene.pick(game.scene.pointerX, game.scene.pointerY)

      this.game.units.forEach((unit) => {
        unit.deselect()
      })

      if (pickResult.hit) {
        const pickedPoint = pickResult.pickedPoint

        if (pickedPoint) {
          this.createBuildings(pickedPoint)
          this.selectRockets(pickedPoint, pickResult)
        }
      }
    })
  }

  populateButtons = () => {
    buttons.forEach((button) => {
      const buttonControl: GUI.Control = GUI.Button.CreateSimpleButton(
        "mode-" + button.mode,
        button.name
      )
      buttonControl.height = "40px"
      buttonControl.color = "white"
      buttonControl.onPointerUpObservable.add(() => {
        this.setCursorMode(button.mode)
      })
      this.panel.addControl(buttonControl)
      this.elements.push(buttonControl)
    })
  }

  setCursorMode(mode: CursorMode) {
    this.cursorMode = mode
    // Update button colors based on the cursor mode
    this.elements.forEach((buttonControl) => {
      buttonControl.background = buttonControl.name === "mode-" + mode ? "blue" : "red"
    })
  }

  update() {
    if (this.game.frame % 60 === 0) this.updateHeader()
  }

  populateHeader(rootPanel: GUI.StackPanel) {
    this.header = new GUI.TextBlock("header")
    this.header.color = "white"
    this.header.fontSize = 16
    this.header.paddingTop = "10px"
    this.header.paddingBottom = "10px"
    rootPanel.addControl(this.header)
  }
}
