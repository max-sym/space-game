import { B } from "~/b"
import { PowerStation } from "./buildings/power-station"
import { Mine } from "./buildings/mine"

export type BuildingType = "power-station" | "mine" | "rocket-launching-site"

export type ModelType = {
  width: number
  length: number
  height: number
}

export const buildingModels: Record<BuildingType, ModelType> = {
  "power-station": {
    width: 0.01,
    length: 0.01,
    height: 0.01,
  },
  mine: {
    width: 0.01,
    length: 0.01,
    height: 0.01,
  },
  "rocket-launching-site": {
    width: 0.01,
    length: 0.01,
    height: 0.01,
  },
}

export const buildingClasses: Record<BuildingType, any> = {
  "power-station": PowerStation,
  mine: Mine,
  "rocket-launching-site": PowerStation,
}

export type BuildingConfig = {
  id: number
  name: string
  /**
   * Position relative to the continent
   */
  position: B.Vector2
  type: BuildingType
}

export type ContinentConfig = {
  name: string
  position: B.Vector2
  size: number
  color: string
  depth: number
  offset: number
  buildings: BuildingConfig[]
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
          buildings: [
            {
              id: 1,
              name: "Power Station",
              position: new B.Vector2(0.1, 0.1),
              type: "power-station",
            },
            {
              id: 2,
              name: "Mine",
              position: new B.Vector2(0.03, 0.0),
              type: "mine",
            },
            {
              id: 3,
              name: "Rocket Launching Site",
              position: new B.Vector2(-0.06, 0.1),
              type: "rocket-launching-site",
            },
          ],
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
