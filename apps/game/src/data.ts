import { B } from "~/b"

export type ContinentConfig = {
  name: string
  position: B.Vector2
  size: number
  color: string
  depth: number
  offset: number
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
    position: new B.Vector3(4, 2, -2),
    target: new B.Vector3(7, 0, 0),
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
          position: new B.Vector2(0.4, 0.4),
          size: 0.3,
          depth: 0.22,
          color: "#330000",
          offset: 0.1,
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
