import { GUI } from "~/b"
import { Game } from ".."

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
