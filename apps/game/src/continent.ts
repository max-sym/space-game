import { B } from "~/b"
import { ContinentConfig } from "~/data"
import { Planet } from "./planet"
import { Unit } from "./unit"

const sphericalPosition = (
  position: B.Vector3,
  sphereRadius: number,
  thetaDegrees: number,
  phiDegrees: number
) => {
  // Convert angles from degrees to radians
  const thetaRadians = B.Tools.ToRadians(thetaDegrees)
  const phiRadians = B.Tools.ToRadians(phiDegrees)

  // Convert spherical coordinates to Cartesian
  const x = sphereRadius * Math.sin(thetaRadians) * Math.cos(phiRadians)
  const y = sphereRadius * Math.sin(thetaRadians) * Math.sin(phiRadians)
  const z = sphereRadius * Math.cos(thetaRadians)

  const newPosition = position.clone()

  // Update the object's position
  newPosition.x = x
  newPosition.y = y
  newPosition.z = z

  return newPosition
}

const rotateTowardsCenter = (center: B.Vector3, position: B.Vector3) => {
  // Calculate direction vector from object to center of sphere
  var direction = center.subtract(position).normalize()

  // Calculate yaw and pitch
  var yaw = -Math.atan2(direction.z, direction.x) - Math.PI / 2
  var pitch = Math.atan2(
    direction.y,
    Math.sqrt(direction.x * direction.x + direction.z * direction.z)
  )

  const rotation = new B.Vector3()

  // Update the object's rotation (assuming Euler angles in radians)
  rotation.y = yaw
  rotation.x = pitch

  return rotation
}

export class Continent extends Unit {
  planet: Planet

  constructor({ planet, config }: { planet: Planet; config: ContinentConfig }) {
    super({ game: planet.game })
    this.planet = planet
    this.model = B.CreateBox(
      config.name,
      {
        depth: config.depth,
        height: config.size,
        width: config.size,
      },
      this.game.scene
    )

    const material = new B.StandardMaterial("continent", this.game.scene)
    material.diffuseColor = B.Color3.FromHexString("#00ff00")

    this.position = this.planet.position.clone()
    const offset = sphericalPosition(
      new B.Vector3(),
      this.planet.config.diameter / 2 - config.offset,
      config.position.x * 360,
      config.position.y * 360
    )

    this.position = this.position.add(offset)
    this.rotation = rotateTowardsCenter(this.planet.position, this.position)
  }
}
