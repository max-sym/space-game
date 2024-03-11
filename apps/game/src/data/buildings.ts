export type BuildingType = "power-station" | "mine" | "rocket-launching-site"

export type ModelType = {
  model: {
    width: number
    length: number
    height: number
    color: string
  }
}

export const buildingModels: Record<BuildingType, ModelType> = {
  "power-station": {
    model: {
      width: 0.8,
      length: 0.8,
      height: 1,
      color: "#000088",
    },
  },
  mine: {
    model: {
      width: 1,
      length: 1,
      height: 0.5,
      color: "#880000",
    },
  },
  "rocket-launching-site": {
    model: {
      width: 1,
      length: 1,
      height: 1,
      color: "#008800",
    },
  },
}
