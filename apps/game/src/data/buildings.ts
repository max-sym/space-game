export type BuildingType = "power-station" | "mine" | "rocket-launching-site"

export type ModelType = {
  model: {
    width: number
    length: number
    height: number
    color: string
  }
}

export type PowerStationConfig = ModelType & {
  production: {
    energy: number
  }
}

export type MineConfig = ModelType & {
  production: {
    /**
     * Rate of production per second.
     */
    rate: number
  }
}

export type RocketLaunchingSiteConfig = ModelType

export type SpecificBuildingConfig =
  | PowerStationConfig
  | MineConfig
  | RocketLaunchingSiteConfig

export const buildingModels: Record<BuildingType, SpecificBuildingConfig> = {
  "power-station": {
    model: {
      width: 0.8,
      length: 0.8,
      height: 1,
      color: "#000088",
    },
    production: {
      energy: 1,
    },
  },
  mine: {
    model: {
      width: 1,
      length: 1,
      height: 0.5,
      color: "#880000",
    },
    production: {
      rate: 1,
    },
  },
  "rocket-launching-site": {
    model: {
      width: 5,
      length: 5,
      height: 0.5,
      color: "#105090",
    },
  },
}
