// import { Game } from "@space-game/game"
import { Game } from "./rocket-planet-collision"
import { useEffect, useRef } from "react"

export const Home = () => {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    new Game({
      canvas: canvas.current as HTMLCanvasElement,
    })

    document.body.style.overflow = "hidden"
  }, [])

  return (
    <div className="h-full">
      <canvas ref={canvas} touch-action="none" className="block w-full h-full" />
    </div>
  )
}
