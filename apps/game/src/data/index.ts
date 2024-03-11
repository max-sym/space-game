import { B } from "~/b"
import { PowerStation } from "../units/buildings/power-station"
import { Mine } from "../units/buildings/mine"
import { BuildingType } from "./buildings"

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
  playerId?: number
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

export type PlayerState = {
  resources: {
    stone: number
    metal: number
    energy: number
    money: number
  }
}

export type PlayerConfig = {
  id: number
  name: string
  color: string
  state: PlayerState
}

export type GameConfig = {
  planets: PlanetConfig[]
  showGrid: boolean
  players: PlayerConfig[]
  camera: {
    position: B.Vector3
    target: B.Vector3
  }
}

export const data: GameConfig = {
  camera: {
    position: new B.Vector3(400, 200, -200),
    target: new B.Vector3(700, 0, 0),
  },
  showGrid: true,
  players: [
    {
      id: 1,
      name: "Blue",
      color: "#005500",
      state: {
        resources: {
          stone: 100,
          metal: 100,
          energy: 100,
          money: 100,
        },
      },
    },
    {
      id: 2,
      name: "Red",
      color: "#770000",
      state: {
        resources: {
          stone: 100,
          metal: 100,
          energy: 100,
          money: 100,
        },
      },
    },
  ],
  planets: [
    {
      name: "earth",
      diameter: 100,
      position: new B.Vector3(700, 0, 0),
      continents: [
        {
          name: "blandia",
          playerId: 1,
          position: new B.Vector2(0.4, 0.4),
          size: 30,
          depth: 22,
          color: "#330000",
          offset: 10,
          buildings: [
            {
              id: 1,
              name: "Power Station",
              position: new B.Vector2(10, 10),
              type: "power-station",
            },
            {
              id: 2,
              name: "Mine",
              position: new B.Vector2(3, 0.0),
              type: "mine",
            },
            {
              id: 3,
              name: "Rocket Launching Site",
              position: new B.Vector2(6, 10),
              type: "rocket-launching-site",
            },
          ],
        },
      ],
      color: "#004477",
    },
    {
      name: "mars",
      diameter: 50,
      position: new B.Vector3(1000, 0, 0),
      continents: [],
      color: "#331100",
    },
  ],
}
