import { B } from "~/b"
import { GameConfig, buildingClasses, data } from "~/data"
import { Planet } from "./units/planet"
import { Unit } from "./units/unit"
import { Grid } from "./grid"
import { Player } from "./player"
import { Continent } from "./units/continent"
import { GameGUI } from "./gui/gui"
import { Rocket } from "./units/rocket"

export class Game {
  canvas: HTMLCanvasElement
  scene: B.Scene
  camera: B.ArcRotateCamera
  config: GameConfig = data
  engine: B.Engine
  units: Unit[] = []
  players: Player[] = []
  gui: GameGUI
  frame = 0

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    this.canvas = canvas
    this.engine = new B.Engine(canvas, false)
    this.scene = new B.Scene(this.engine)

    this.init()
    this.gui = new GameGUI({ game: this })
  }

  createPlayers = () => {
    this.config.players.forEach((playerConfig) => {
      this.players.push(new Player({ game: this, config: playerConfig }))
    })
  }

  populateRockets = () => {
    this.config.rockets.forEach((rocketConfig) => {
      this.units.push(new Rocket({ game: this, config: rocketConfig }))
    })
  }

  init = () => {
    this.createPlayers()
    this.populatePlanets()
    this.populateContinents()
    this.populateBuildings()
    this.populateRockets()
    this.initCamera()
    this.initEnv()
    this.engine.runRenderLoop(() => {
      this.update()
      this.scene.render()
    })
  }

  update = () => {
    this.frame++
    this.units.forEach((unit) => {
      unit.update()
    })
    this.players.forEach((player) => {
      player.update()
    })
    this.gui.update()
  }

  initCamera = () => {
    this.camera = new B.ArcRotateCamera(
      "main-camera",
      3.5,
      1.5,
      100,
      // this.config.camera.target.position,
      this.units.find((u) => u.type === "continent" && u.config.id === 1).position,
      this.scene
    )
    this.camera.fov = 0.4
    this.camera.minZ = 0.1
    this.camera.attachControl(this.canvas, true)
    // this.camera.upVector = this.units[0].continents[0].rotation.clone()
  }

  initEnv = () => {
    var light = new B.PointLight("light1", new B.Vector3(0, 0, 0), this.scene)

    light.intensity = 1.3

    if (this.config.showGrid) {
      new Grid({ game: this })
    }
  }

  populatePlanets = () => {
    this.config.planets.forEach((planet) => {
      this.units.push(new Planet({ game: this, config: planet }))
    })
  }

  populateContinents = () => {
    this.config.continents.forEach((continent) => {
      this.units.push(new Continent({ game: this, config: continent }))
    })
  }

  /**
   * Populates buildings on the continent based on the configuration.
   */
  populateBuildings() {
    this.config.buildings.forEach((buildingConfig) => {
      const buildingClass = buildingClasses[buildingConfig.type]
      const building = new buildingClass({
        continent: this,
        config: buildingConfig,
        game: this,
      })
      this.units.push(building)
    })
  }
}
