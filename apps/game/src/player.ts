import { Game } from "."
import { PlayerConfig, PlayerState } from "./data"

export class Player {
  state: PlayerState
  game: Game
  config: PlayerConfig

  constructor({ game, config }: { game: Game; config: PlayerConfig }) {
    this.config = config
    this.state = JSON.parse(JSON.stringify(this.config.state))
    this.game = game
  }
}
