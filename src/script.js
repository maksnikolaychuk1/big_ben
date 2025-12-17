import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { gsap } from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
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
Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
    void main() { gl_Position = vec4(position, 1.0); }
  `,
  fragmentShader: `
    uniform float uAlpha;
    void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha); }
  `,
});
 const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
 scene.add(overlay)

 /**
Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
 // Loaded
 () =>
  {
 window.setTimeout(() =>
 {
 gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1, onComplete: () => {
        overlay.geometry.dispose()
        overlay.material.dispose()
        scene.remove(overlay)
    } })
       loadingBarElement.classList.add('ended')
        loadingBarElement.style.transform = ''
    }, 500)
},
// Progress
(itemUrl, itemsLoaded, itemsTotal) =>
{
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})`
}
)
const gltfLoader = new GLTFLoader(loadingManager)
const rgbeLoader = new RGBELoader(loadingManager)
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

rgbeLoader.load('/hdr/qwantani_dusk_2_puresky_4k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap

    scene.environmentIntensity = 0.05
    scene.backgroundIntensity = 0.1
})

//Models
gltfLoader.load('./assets/bigben/scene.gltf', (gltf) => {
    const bigben = gltf.scene
    bigben.scale.set(5, 5, 5)
    bigben.position.set(-50, -4.30, 0)

        bigben.traverse(o => {
        if(o.isMesh){
            o.castShadow = true
            o.receiveShadow = true
        }
    })
    scene.add(bigben)
})

let bench1 = null
let bench2 = null
let bench3 = null

gltfLoader.load('./assets/bench/scene.gltf', (gltf) => {
    const bench = gltf.scene
    bench.scale.set(0.5, 0.5, 0.5)
    bench.position.set(-6, 0, 4)

    bench.traverse(o => {
        if(o.isMesh){
            o.castShadow = true
            o.receiveShadow = true
        }
    })
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
    
    fountain.traverse(o => {
        if(o.isMesh){
            o.castShadow = true
            o.receiveShadow = true
        }
    })
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

// Smoke Shader Material
const smokeTexture = textureLoader.load('./smoke/noiseTexture.png')

smokeTexture.wrapS = THREE.RepeatWrapping
smokeTexture.wrapT = THREE.RepeatWrapping

const smokeParams = {
    speed: 4.0,
    opacity: 0.15,
    color: '#e5e5e5'
}

const smokeMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,

    uniforms: {
        uTexture: { value: smokeTexture },
        uTime: { value: 0.0 },
        uSpeed: { value: smokeParams.speed },
        uOpacity: { value: smokeParams.opacity },
        uColor: { value: new THREE.Color(smokeParams.color) }
    },

    vertexShader: `
        varying vec2 vUv;

        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
        }
    `,

    fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uOpacity;
        uniform vec3 uColor;

        varying vec2 vUv;


        // простий псевдо-noise рух
        vec2 flow(vec2 uv, float speed){
            uv += vec2(
                sin(uTime * speed * uSpeed + uv.y * 2.0),
                cos(uTime * speed * uSpeed * 1.3 + uv.x * 2.0)
            );
            return uv;
        }

        void main(){

            vec2 uv = vUv;

            // Щільний масштаб патерну
            uv *= 3.5;

            // 2 незалежні напрями руху
            vec2 uv1 = flow(uv, 0.15);
            vec2 uv2 = flow(uv * 1.3 + 10.0, 0.08);

            float n1 = texture2D(uTexture, uv1).r;
            float n2 = texture2D(uTexture, uv2).r;

            float smoke = (n1 + n2) * 0.5;

            // Контрастність
            smoke = smoothstep(0.3, 1.0, smoke);

            // Вінеєтка країв площин
            smoke *= smoothstep(0.0, 0.15, vUv.x);
            smoke *= smoothstep(1.0, 0.85, vUv.x);
            smoke *= smoothstep(0.0, 0.15, vUv.y);
            smoke *= smoothstep(1.0, 0.85, vUv.y);

            gl_FragColor = vec4(uColor, smoke * uOpacity);


            #include <colorspace_fragment>
        }
    `
});
const smokeFolder = gui.addFolder('Ground Fog')

smokeFolder.add(smokeParams, 'speed', 0.1, 10, 0.01).onChange(v => {
    smokeMaterial.uniforms.uSpeed.value = v
})

smokeFolder.add(smokeParams, 'opacity', 0.01, 0.5, 0.01).onChange(v => {
    smokeMaterial.uniforms.uOpacity.value = v
})

smokeFolder.addColor(smokeParams, 'color').onChange(v => {
    smokeMaterial.uniforms.uColor.value.set(v)
})

smokeFolder.open()
const smokeGroup = new THREE.Group()
scene.add(smokeGroup)

const layerCount = 9
const floorSize = 15

for(let i = 0; i < layerCount; i++){

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(floorSize + 4, floorSize + 4),
        smokeMaterial
    )

    plane.rotation.x = -Math.PI / 2

    // висота шару
    plane.position.y = 0.05 + i * 0.10

    // дрібні зсуви для хаосу
    plane.position.x = (Math.random() - 0.5) * 3
    plane.position.z = (Math.random() - 0.5) * 3

    // варіація масштабів
    const s = 0.9 + Math.random() * 0.3
    plane.scale.set(s, s, s)

    smokeGroup.add(plane)
}


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
controls.minDistance = 2
controls.maxDistance = 15
controls.minPolarAngle = Math.PI * 0.2
controls.maxPolarAngle = Math.PI * 0.49

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
floor.receiveShadow = true

// Mappings
directionalLight.shadow.mapSize.set(512, 512)

directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 60

directionalLight.shadow.camera.top = 25
directionalLight.shadow.camera.right = 25
directionalLight.shadow.camera.bottom = -25
directionalLight.shadow.camera.left = -25

directionalLight.shadow.bias = -0.0003

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
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()
    
    // Smoke animation
    smokeMaterial.uniforms.uTime.value = elapsedTime

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