import { Game } from "@space-game/game"
import { useEffect } from "react"

export const Home = () => {
  useEffect(() => {
    const game = new Game()
    console.log(game.foo)
  }, [])

  return <div>Heloo World</div>
}
