import { B } from "~/b"
import { PowerStation } from "../units/buildings/power-station"
import { Mine } from "../units/buildings/mine"
import { BuildingType } from "./buildings"

export type UnitType = "building" | "continent" | "planet"

export const buildingClasses: Record<BuildingType, any> = {
  "power-station": PowerStation,
  mine: Mine,
  "rocket-launching-site": PowerStation,
}

export type BuildingConfig = {
  id: number
  name: string
  playerId: number
  continentId: number
  /**
   * Position relative to the continent
   */
  position: B.Vector2
  type: BuildingType
}

export type ContinentConfig = {
  id: number
  name: string
  planetId?: number
  position: B.Vector2
  size: number
  color: string
  depth: number
  offset: number
}

export type PlanetConfig = {
  id: number
  name: string
  diameter: number
  position: B.Vector3
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

export type RocketConfig = {
  id: number
  name: string
  color: string
  position: B.Vector3
  rotation: B.Vector3
  dimentions: {
    width: number
    height: number
    length: number
  }
  mass: number
}

export type GameConfig = {
  planets: PlanetConfig[]
  showGrid: boolean
  players: PlayerConfig[]
  continents: ContinentConfig[]
  buildings: BuildingConfig[]
  rockets: RocketConfig[]
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
          stone: 1200,
          metal: 165400,
          energy: 16400,
          money: 198700,
        },
      },
    },
  ],
  continents: [
    {
      id: 1,
      name: "blandia",
      planetId: 1,
      position: new B.Vector2(0.4, 0.4),
      size: 30,
      depth: 22,
      color: "#009900",
      offset: 10,
    },
    {
      id: 2,
      name: "blandia's enemy",
      planetId: 1,
      position: new B.Vector2(0.3, 0.5),
      size: 30,
      depth: 22,
      color: "#009050",
      offset: 10,
    },
  ],
  buildings: [
    {
      id: 1,
      playerId: 1,
      continentId: 1,
      name: "Power Station",
      position: new B.Vector2(10, 10),
      type: "power-station",
    },
    {
      id: 2,
      playerId: 1,
      name: "Mine",
      continentId: 1,
      position: new B.Vector2(3, 0.0),
      type: "mine",
    },
    {
      id: 3,
      playerId: 1,
      continentId: 1,
      name: "Rocket Launching Site",
      position: new B.Vector2(6, 10),
      type: "rocket-launching-site",
    },
    {
      id: 4,
      playerId: 2,
      continentId: 2,
      name: "Rocket Launching Site",
      position: new B.Vector2(6, 10),
      type: "rocket-launching-site",
    },
  ],
  planets: [
    {
      id: 1,
      name: "earth",
      diameter: 100,
      position: new B.Vector3(700, 0, 0),
      color: "#004477",
    },
    {
      id: 2,
      name: "mars",
      diameter: 50,
      position: new B.Vector3(1000, 0, 0),
      color: "#331100",
    },
  ],
  rockets: [
    {
      id: 1,
      name: "Rocket 1",
      color: "#550000",
      dimentions: {
        height: 0.3,
        length: 1,
        width: 0.3,
      },
      mass: 1,
      position: new B.Vector3(700, 0, -70),
      rotation: new B.Vector3(0, 90, 0),
    },
  ],
}
