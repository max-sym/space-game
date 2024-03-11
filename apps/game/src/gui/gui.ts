import { GUI } from "~/b"
import { Game } from ".."

// Subscribe to the stoneGenerated event
// document.addEventListener("stoneGenerated", () => {
//   // Update the text block with the stone generation message
//   stoneMessage.text = "+10 stone produced" // Update with the appropriate message
//   // Reset the message after a certain duration (optional)
//   setTimeout(() => {
//     stoneMessage.text = ""
//   }, 5000) // 5000 milliseconds (5 seconds) for example
// })

export class GameGUI {
  game: Game

  constructor({ game }: { game: Game }) {
    this.game = game
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")

    const panel = new GUI.StackPanel()
    panel.width = "220px"
    advancedTexture.addControl(panel)
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT

    const button = GUI.Button.CreateSimpleButton("but", "Click Me")
    button.height = "40px"
    button.color = "white"
    button.background = "green"
    panel.addControl(button)

    const button2 = GUI.Button.CreateSimpleButton("but2", "Click Me also!")
    button2.height = "40px"
    button2.color = "white"
    button2.background = "green"
    panel.addControl(button2)
  }
}
