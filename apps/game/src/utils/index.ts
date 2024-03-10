import { B } from "~/b"

export const sphericalPosition = (
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

export const rotateTowardsCenter = (center: B.Vector3, position: B.Vector3) => {
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
