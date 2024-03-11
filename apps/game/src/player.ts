import { Game } from "."
import { PlayerConfig, PlayerState } from "./data"

export class Player {
  state: PlayerState
  game: Game
  config: PlayerConfig
  lastResourceLogTime: number = Date.now() // Timestamp of the last resource log

  constructor({ game, config }: { game: Game; config: PlayerConfig }) {
    this.config = config
    this.state = JSON.parse(JSON.stringify(this.config.state))
    this.game = game
  }

  /**
   * Updates the state of the continent.
   */
  update() {
    // Log resource amount every 30 seconds
    if (Date.now() - this.lastResourceLogTime >= 1000) {
      this.logResourceAmount()
      this.lastResourceLogTime = Date.now()
    }
  }

  /**
   * Logs the amount of stone resources.
   */
  logResourceAmount() {
    console.log("Total Stone Amount:", this.state.resources.stone)
  }
}
