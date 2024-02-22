import { B } from "~/b"

export type PlanetConfig = {
  name: string
  diameter: number
  position: B.Vector3
}

export type GameConfig = {
  planets: PlanetConfig[]
}

export const data: GameConfig = {
  planets: [
    {
      name: "earth",
      diameter: 1,
      position: new B.Vector3(0, 0, 0),
    },
    {
      name: "mars",
      diameter: 1,
      position: new B.Vector3(3, 0, 0),
    },
  ],
}
