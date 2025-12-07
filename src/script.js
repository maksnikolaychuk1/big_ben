import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { color } from 'three/tsl'

/**
 * Base
 */
// Debug
const gui = new GUI()



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/brick_pavement_02_1k/brick_pavement_02_diff_1k.jpg')
const floorARMTexture = textureLoader.load('./floor/brick_pavement_02_1k/brick_pavement_02_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('./floor/brick_pavement_02_1k/brick_pavement_02_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/brick_pavement_02_1k/brick_pavement_02_disp_1k.jpg')
const repeat = 4

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

floorColorTexture.repeat.set(repeat, repeat)
floorARMTexture.repeat.set(repeat, repeat)
floorNormalTexture.repeat.set(repeat, repeat)
floorDisplacementTexture.repeat.set(repeat, repeat)

floorColorTexture.colorSpace = THREE.SRGBColorSpace

//Road
const roadAlphaTexture = textureLoader.load('./road/alpha.jpg')
const roadColorTexture = textureLoader.load('./road/asphalt_02_1k/asphalt_02_diff_1k.jpg')
const roadARMTexture = textureLoader.load('./road/asphalt_02_1k/asphalt_02_arm_1k.jpg')
const roadNormalTexture = textureLoader.load('./road/asphalt_02_1k/asphalt_02_nor_gl_1k.jpg')
const roadDisplacementTexture = textureLoader.load('./road/asphalt_02_1k/asphalt_02_disp_1k.jpg')

roadColorTexture.wrapS = THREE.RepeatWrapping
roadARMTexture.wrapS = THREE.RepeatWrapping
roadNormalTexture.wrapS = THREE.RepeatWrapping
roadDisplacementTexture.wrapS = THREE.RepeatWrapping

roadColorTexture.wrapT = THREE.RepeatWrapping
roadARMTexture.wrapT = THREE.RepeatWrapping
roadNormalTexture.wrapT = THREE.RepeatWrapping
roadDisplacementTexture.wrapT = THREE.RepeatWrapping

roadColorTexture.repeat.set(1, 6)
roadNormalTexture.repeat.set(1, 6)
roadARMTexture.repeat.set(1, 6)
roadDisplacementTexture.repeat.set(1, 6)

roadColorTexture.colorSpace = THREE.SRGBColorSpace

//GLTF Loader
const gltfLoader = new GLTFLoader()
gltfLoader.load('./assets/bigben/scene.gltf', (gltf) => {
    const bigben = gltf.scene
    bigben.scale.set(5, 5, 5)
    bigben.position.set(-50, -4.30, 0)
    scene.add(bigben)
})

let bench1 = null
let bench2 = null
let bench3 = null

gltfLoader.load('./assets/bench/scene.gltf', (gltf) => {
    const bench = gltf.scene
    bench.scale.set(0.5, 0.5, 0.5)
    bench.position.set(-6, 0, 4)
    scene.add(bench)

    bench1 = bench.clone()
    bench1.position.set(-2.8, 0, 8)
    bench1.rotation.y = Math.PI
    scene.add(bench1)

    bench2 = bench.clone()
    bench2.position.set(-6.3, 0, 7.5)
    bench2.rotation.y = Math.PI / 2
    scene.add(bench2)

    bench3 = bench.clone()
    bench3.position.set(-2.5, 0, 4.5)
    bench3.rotation.y = 11
    scene.add(bench3)
})

gltfLoader.load('./assets/fountain/scene.gltf', (gltf) => {
    const fountain = gltf.scene
    fountain.scale.set(0.1, 0.1, 0.1)
    fountain.position.set(-4.4, 0, 6)
    scene.add(fountain)
})
/**
 * BigBen
 */

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 200, 200),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: false,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: - 0.2
    })
)

// gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floorDisplacementScale')
// gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('floorDisplacementBias')

floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

// Road

const roadWidth = 3
const roadLength = 20
const roadHeight = 0.1

const road = new THREE.Mesh(
    new THREE.BoxGeometry(roadWidth, roadHeight, roadLength),
    new THREE.MeshStandardMaterial({
        alphaMap: roadAlphaTexture,
        transparent: false,
        map: roadColorTexture,
        aoMap: roadARMTexture,
        roughnessMap: roadARMTexture,
        metalnessMap: roadARMTexture,
    })
)

road.position.y = roadHeight / 2 + 0.01

road.position.x = 5
road.position.z = 0

scene.add(road)


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


/**
 * Shadows
 */
// Cast and receive
directionalLight.castShadow = true

// ghost1.castShadow = true
// ghost2.castShadow = true
// ghost3.castShadow = true

// walls.castShadow = true
// walls.receiveShadow = true
// roof.castShadow = true
floor.receiveShadow = true

// for(const grave of graves.children)
// {
//     grave.castShadow = true
//     grave.receiveShadow = true
// }

// Mappings
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

// ghost1.shadow.mapSize.width = 256
// ghost1.shadow.mapSize.height = 256
// ghost1.shadow.camera.far = 10

// ghost2.shadow.mapSize.width = 256
// ghost2.shadow.mapSize.height = 256
// ghost2.shadow.camera.far = 10

// ghost3.shadow.mapSize.width = 256
// ghost3.shadow.mapSize.height = 256
// ghost3.shadow.camera.far = 10

/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)


sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Rain particles
 */
const rainCount = 5000

const rainGeometry = new THREE.BufferGeometry()
const rainPositions = new Float32Array(rainCount * 3)

for (let i = 0; i < rainCount; i++) {
    rainPositions[i * 3] = (Math.random() - 0.5) * 60   // X
    rainPositions[i * 3 + 1] = Math.random() * 20 + 10 // Y
    rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 // Z
}

rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3))

const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.05,
    transparent: true,
    opacity: 0.7
})

const rain = new THREE.Points(rainGeometry, rainMaterial)
scene.add(rain)

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#04343f', 1, 13)
// scene.fog = new THREE.FogExp2('#04343f', 0.1)



/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Rain animation
    const positions = rain.geometry.attributes.position.array

    for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= 0.25

    // Якщо крапля впала — знову вгору
    if (positions[i * 3 + 1] < 0) {
        positions[i * 3 + 1] = Math.random() * 20 + 10
        }
    }

    rain.geometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()