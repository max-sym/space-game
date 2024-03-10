import { B } from "~/b"

export type ContinentConfig = {
  name: string
  position: B.Vector2
  size: number
}

export type PlanetConfig = {
  name: string
  diameter: number
  position: B.Vector3
  continents: ContinentConfig[]
  color: string
}

export type GameConfig = {
  planets: PlanetConfig[]
  showGrid: boolean
  camera: {
    position: B.Vector3
    target: B.Vector3
  }
}

export const data: GameConfig = {
  camera: {
    position: new B.Vector3(0, 5, -10),
    target: B.Vector3.Zero(),
  },
  showGrid: true,
  planets: [
    {
      name: "earth",
      diameter: 1,
      position: new B.Vector3(7, 0, 0),
      continents: [
        {
          name: "blandia",
          position: new B.Vector2(0, 0),
          size: 0.5,
        },
      ],
      color: "#004477",
    },
    {
      name: "mars",
      diameter: 0.5,
      position: new B.Vector3(10, 0, 0),
      continents: [],
      color: "#331100",
    },
  ],
}
