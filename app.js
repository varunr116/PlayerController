const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
})

renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.set(0, 10, 10)
camera.lookAt(0, 0, 0)

// created a plane
const planeGeometry = new THREE.PlaneGeometry(10, 10)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  side: THREE.DoubleSide,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
scene.add(plane)

const playerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32) // Haveing Cylinder as a player
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const player = new THREE.Mesh(playerGeometry, playerMaterial)
scene.add(player)

player.position.y = 0.5

let isMoving = false
let moveDirection = { x: 0, z: 0 }
let moveSpeed = 0.05 // Speed

function animate() {
  requestAnimationFrame(animate)

  if (isMoving) {
    player.position.x += moveDirection.x * moveSpeed
    player.position.z += moveDirection.z * moveSpeed
    constrainPlayerToPlane()
  }

  renderer.render(scene, camera)
}
animate()

// Hammer.js swipe detection for real-time direction change
const hammer = new Hammer(document.body)
hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL })

// Detect panstart to start movement
hammer.on("panstart", (event) => {
  isMoving = true // Start moving the player
  updateMovementDirection(event) // Set initial movement direction
})

// Continuously update the player's direction while swiping
hammer.on("panmove", (event) => {
  updateMovementDirection(event) // Update direction as swipe changes
})

// Stop movement when the swipe ends
hammer.on("panend", () => {
  isMoving = false // Stop moving the player
})

// Function to update the movement direction based on swipe
function updateMovementDirection(event) {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    moveDirection.x = event.deltaX > 0 ? 1 : -1
    moveDirection.z = 0
  } else {
    // Vertical swipe
    moveDirection.z = event.deltaY > 0 ? 1 : -1
    moveDirection.x = 0
  }
}

// Function to constrain the player's movement to within the plane's bounds
function constrainPlayerToPlane() {
  const planeSize = 5
  player.position.x = Math.max(
    -planeSize,
    Math.min(planeSize, player.position.x)
  )
  player.position.z = Math.max(
    -planeSize,
    Math.min(planeSize, player.position.z)
  )
}

// Window resize handling for responsiveness
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

// Button controls for movement on the plane
document.getElementById("left").addEventListener("click", () => {
  player.position.x -= 0.5
  constrainPlayerToPlane()
})
document.getElementById("right").addEventListener("click", () => {
  player.position.x += 0.5
  constrainPlayerToPlane()
})
document.getElementById("up").addEventListener("click", () => {
  player.position.z -= 0.5
  constrainPlayerToPlane()
})
document.getElementById("down").addEventListener("click", () => {
  player.position.z += 0.5
  constrainPlayerToPlane()
})
