import { Game } from "@space-game/game"
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
    <div>
      <canvas
        ref={canvas}
        touch-action="none"
        className="w-full h-full block"
      />
    </div>
  )
}
