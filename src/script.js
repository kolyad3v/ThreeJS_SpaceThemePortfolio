import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import Stats from 'stats.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import starsVertexShader from './shaders/stars/vertex.glsl'
import starsFragmentShader from './shaders/stars/fragment.glsl'

import waterFragmentShader from './shaders/water/fragment.glsl'
import waterVertexShader from './shaders/water/vertex.glsl'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

/**
 * Loading Screen
 */

// const loadingBarElement = document.querySelector('.loading-bar')

// const loadingManager = new THREE.LoadingManager(
//loaded

//  () => {
//   gsap.delayedCall(1, () => {
//    gsap.to(overlayMaterial.uniforms.uAlpha, {
//     duration: 3,
//     value: 0,
//     delay: 1,
//    })
//    loadingBarElement.classList.add('ended')
//    loadingBarElement.style.transform = ''
//   })
//  },

//  // progress
//  (itemUrl, itemsLoaded, itemsTotal) => {
//   const progressRatio = itemsLoaded / itemsTotal
//   loadingBarElement.style.transform = `scaleX(${progressRatio})`
//  }
// )

/**
 * stats
 */
/// ADDED TO OOP
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)
/// ADDED TO OOP

/**
 * Debug
 */
// const gui = new dat.GUI()
// gui.width = 500

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene

/**
 * Objects
 */

// Loaders
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()
const taxleTexture = textureLoader.load('./textures/taxle.jpg')
const ffgTexture = textureLoader.load('./textures/ffg.jpg')

const scene = new THREE.Scene()

// const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
// const overlayMaterial = new THREE.ShaderMaterial({
//  transparent: true,
//  uniforms: {
//   uAlpha: { value: 0.5 },
//  },
//  vertexShader: `
//     void main()
//     {
//         gl_Position = vec4(position, 1.0);
//     }
//     `,
//  fragmentShader: `
//     uniform float uAlpha;
//     void main()
//     {
//         gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
//     }
//     `,
// })

// const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)

// scene.add(overlay)

//meshes distance
const objectsDistance = 4

/**
 * Enviroment Map
 */

const environmentMap = cubeTextureLoader.load([
	'/textures/environmentMaps/5/px.png',
	'/textures/environmentMaps/5/nx.png',
	'/textures/environmentMaps/5/py.png',
	'/textures/environmentMaps/5/ny.png',
	'/textures/environmentMaps/5/pz.png',
	'/textures/environmentMaps/5/nz.png',
])

environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

// environmentMap.rotation = 3.14
// meshes

const material = new THREE.MeshStandardMaterial()

material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
material.metalness = 1
material.roughness = 0
material.emissive = new THREE.Color('#ffffff')
material.emissiveIntensity = 0.3

const ethGeometry = new THREE.OctahedronGeometry(1)
const mesh1 = new THREE.Mesh(ethGeometry, material)

// Colors
const debugObject = {}

/**
 * Material Mirror Ball // PROJECTS
 */

const projectPlaneGeometry = new THREE.PlaneGeometry(3, 2)
const projectPlaneMaterial = new THREE.MeshBasicMaterial({ map: taxleTexture })

const taxleMesh = new THREE.Mesh(projectPlaneGeometry, projectPlaneMaterial)
taxleMesh.position.x = 7.843
taxleMesh.rotation.y = 4.472
taxleMesh.position.z = 7.571
// gui.add(taxleMesh.rotation, 'y').min(0).max(10).step(0.001)
// gui.add(taxleMesh.position, 'x').min(0).max(15).step(0.001)
// gui.add(taxleMesh.position, 'z').min(0).max(12).step(0.001)

const ffgMesh = new THREE.Mesh(
	projectPlaneGeometry,
	new THREE.MeshBasicMaterial({ map: ffgTexture })
)

ffgMesh.position.x = 5.729
ffgMesh.rotation.y = 3.927
ffgMesh.position.z = 11.213
// gui.add(ffgMesh.rotation, 'y').min(0).max(10).step(0.001)
// gui.add(ffgMesh.position, 'x').min(0).max(15).step(0.001)
// gui.add(ffgMesh.position, 'z').min(0).max(12).step(0.001)

scene.add(taxleMesh, ffgMesh)

const materialEarth = new THREE.MeshStandardMaterial()
materialEarth.metalness = 0.248
materialEarth.roughness = 0
// materialEarth.envMap = environmentMap
materialEarth.envMapIntensity = 15
// gui.add(materialEarth, 'metalness').min(0).max(1).step(0.001)
// gui.add(materialEarth, 'roughness').min(0).max(1).step(0.001)
// gui.add(materialEarth, 'envMapIntensity').min(0).max(50).step(0.001)
const mesh2 = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), materialEarth)

/**
 * Material Sun
 */
debugObject.depthColor = '#ff700c'
debugObject.surfaceColor = '#ffffff'

// const materialSphere = new THREE.ShaderMaterial({
//  vertexShader: waterVertexShader,
//  fragmentShader: waterFragmentShader,
//  uniforms: {
//   uTime: { value: 0 },

//   uBigWavesElevation: { value: 0 },
//   uBigWavesFrequency: { value: new THREE.Vector2(10, 9.403) },
//   uBigWavesSpeed: { value: 0.258 },

//   uSmallWavesElevation: { value: 0.119 },
//   uSmallWavesFrequency: { value: 4.531 },
//   uSmallWavesSpeed: { value: 0.301 },
//   uSmallIterations: { value: 10 },

//   uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
//   uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
//   uColorOffset: { value: 0.065 },
//   uColorMultiplier: { value: 5 },
//  },
// })

const materialSphere = new THREE.MeshPhysicalMaterial()
materialSphere.metalness = 0
materialSphere.roughness = 0.3175
// gui.add(materialSphere, 'metalness').min(0).max(1).step(0.0001)
// gui.add(materialSphere, 'roughness').min(0).max(1).step(0.0001)
// materialSphere.map = alienColorTexture
// materialSphere.aoMap = alienAmbientOcclusionTexture
materialSphere.aoMapIntensity = 1
// materialSphere.displacementMap = alienDisplacementTexture
materialSphere.displacementScale = 0.05
// materialSphere.normalMap = alienNormalTexture
// materialSphere.specularColorMap = alienSpecularityTexture
materialSphere.envMap = environmentMap
materialSphere.envMapIntensity = 50
// gui.add(materialSphere, 'envMapIntensity').min(0).max(50).step(0.0001s)

const mesh3 = new THREE.Mesh(
	new THREE.SphereGeometry(1, 32, 16),
	materialSphere
)

// gui.addColor(debugObject, 'depthColor').onChange(() => {
//  materialSphere.uniforms.uDepthColor.value.set(debugObject.depthColor)
// })
// gui.addColor(debugObject, 'surfaceColor').onChange(() => {
//  materialSphere.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
// })

// gui
//  .add(materialSphere.uniforms.uBigWavesElevation, 'value')
//  .min(0)
//  .max(1)
//  .step(0.001)
//  .name('uBigWavesElevation')
// gui
//  .add(materialSphere.uniforms.uBigWavesFrequency.value, 'x')
//  .min(0)
//  .max(10)
//  .step(0.001)
//  .name('uBigWavesFrequencyX')
// gui
//  .add(materialSphere.uniforms.uBigWavesFrequency.value, 'y')
//  .min(0)
//  .max(10)
//  .step(0.001)
//  .name('uBigWavesFrequencyY')
// gui
//  .add(materialSphere.uniforms.uBigWavesSpeed, 'value')
//  .min(0)
//  .max(4)
//  .step(0.001)
//  .name('uBigWavesSpeed')

// gui
//  .add(materialSphere.uniforms.uSmallWavesElevation, 'value')
//  .min(0)
//  .max(1)
//  .step(0.001)
//  .name('uSmallWavesElevation')
// gui
//  .add(materialSphere.uniforms.uSmallWavesFrequency, 'value')
//  .min(0)
//  .max(30)
//  .step(0.001)
//  .name('uSmallWavesFrequency')
// gui
//  .add(materialSphere.uniforms.uSmallWavesSpeed, 'value')
//  .min(0)
//  .max(4)
//  .step(0.001)
//  .name('uSmallWavesSpeed')
// gui
//  .add(materialSphere.uniforms.uSmallIterations, 'value')
//  .min(0)
//  .max(5)
//  .step(1)
//  .name('uSmallIterations')

// gui
//  .add(materialSphere.uniforms.uColorOffset, 'value')
//  .min(0)
//  .max(1)
//  .step(0.001)
//  .name('uColorOffset')
// gui
//  .add(materialSphere.uniforms.uColorMultiplier, 'value')
//  .min(0)
//  .max(10)
//  .step(0.001)
//  .name('uColorMultiplier')

// const material2 = new THREE.MeshMatcapMaterial()
// material2.matcap = matcapTexture

mesh1.position.y = -objectsDistance * 0
mesh2.position.y = -objectsDistance * 1
taxleMesh.position.y = -objectsDistance * 1
ffgMesh.position.y = -objectsDistance * 1

mesh3.position.y = -objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2

mesh3.position.x = 2
mesh3.position.z = -2

// add to scene
scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh3]

// lights

// const directionalLight = new THREE.AmbientLight('#ffffff', 50)
// // directionalLight.position.set(0, 0, 0)
// // directionalLight.lookAt(mesh2)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener('resize', () => {
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

// camera group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(
	35,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.z = 6
// camera.rotation.x = 0.3
cameraGroup.add(camera)

/**
 * SpaceShip Controls
 */

const horizontalChange = (2 * Math.PI) / 3
console.log(horizontalChange)

document.addEventListener('keydown', async (e) => {
	// stops the scrolling of the page when the arrow keys are hit

	switch (e.code) {
		case 'ArrowUp':
			e.preventDefault()
			await gsap.to(camera.rotation, {
				duration: 1.5,
				ease: 'power2.inOut',
				x: '+=0.3',
				y: '+=0',
			})
			console.log('up')

			break
		case 'ArrowDown':
			e.preventDefault()
			await gsap.to(camera.rotation, {
				duration: 1.5,
				ease: 'power2.inOut',
				x: '-=0.3',
				y: '+=0',
			})
			console.log('down')

			break
		case 'ArrowLeft':
			await gsap.to(camera.rotation, {
				duration: 1.5,
				ease: 'power2.inOut',
				x: '+=0',
				y: `+=${horizontalChange}`,
			})

			break
		case 'ArrowRight':
			await gsap.to(camera.rotation, {
				duration: 1.5,
				ease: 'power2.inOut',
				x: '+=0',
				y: `-=${horizontalChange}`,
			})

			break
		default:
			break
	}

	console.log(camera.rotation)
})

// let clickLeft = document.getElementById('clickLeft')
// clickLeft.addEventListener('click', async () => {
//  await gsap.to(camera.rotation, {
//   duration: 1.5,
//   ease: 'power2.inOut',
//   x: '+=0',
//   y: `+=${horizontalChange}`,
//  })
//  console.log('done')
//  console.log(camera.rotation)
// })

// let clickRight = document.getElementById('clickRight')
// clickRight.addEventListener('click', async () => {
//  await gsap.to(camera.rotation, {
//   duration: 1.5,
//   ease: 'power2.inOut',
//   x: '+=0',
//   y: `-=${horizontalChange}`,
//  })
//  console.log('done')
//  console.log(camera.rotation)
// })

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
	antialias: true,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (e) => {
	cursor.x = e.clientX / sizes.width - 0.5
	cursor.y = e.clientY / sizes.height - 0.5
	//  console.log(cursor)
})

/**
 *  PARTICLES
 */
// GEOMETRY
const starParams = {}
starParams.particleNum = 12000
starParams.color = '#ffffff'

let starGeometry = null
let starMaterial = null
let starPoints = null

const generateStars = () => {
	if (starPoints !== null) {
		starGeometry.dispose()
		starMaterial.dispose()
		scene.remove(starPoints)
	}

	starGeometry = new THREE.BufferGeometry()
	const positions = new Float32Array(starParams.particleNum * 3)
	const scales = new Float32Array(starParams.particleNum)
	const colors = new Float32Array(starParams.particleNum * 3)

	const color = new THREE.Color(starParams.color)

	for (let i = 0; i < starParams.particleNum; i++) {
		const i3 = i * 3

		positions[i3 + 0] = (Math.random() - 0.5) * 10
		positions[i3 + 1] =
			objectsDistance * 0.5 -
			Math.random() * objectsDistance * sectionMeshes.length
		positions[i3 + 2] = (Math.random() - 0.5) * 100

		scales[i] = Math.random() * 5

		colors[i3] = color.r
		colors[i3 + 1] = color.g
		colors[i3 + 2] = color.b
	}

	starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

	starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

	starGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

	// SHADER

	starMaterial = new THREE.ShaderMaterial({
		//  color: parameters.materialColor,
		//  sizeAttenuation: true,
		//  size: 0.03,
		vertexColors: true,
		blending: THREE.AdditiveBlending,
		vertexShader: starsVertexShader,
		fragmentShader: starsFragmentShader,
		depthWrite: false,
		uniforms: {
			uTime: { value: 0 },
			uSize: { value: 3 * renderer.getPixelRatio() },
		},
	})

	starPoints = new THREE.Points(starGeometry, starMaterial)
	scene.add(starPoints)
}

generateStars()

// gui
//  .add(starParams, 'particleNum')
//  .min(0)
//  .max(100000)
//  .step(100)
//  .onFinishChange(generateStars)
// gui.addColor(starParams, 'color').onFinishChange(generateStars)

/**
 * FONTS
 */
debugObject.emissiveColor = '#828282'

// const aboutMaterial = materialSphere
// console.log(aboutMaterial)

// hello
const fontLoader = new FontLoader()
fontLoader.load('/fonts/Exan_Regular.json', (font) => {
	// material

	const materialText = new THREE.MeshStandardMaterial()
	//  materialText.wireframe = true

	//  material.color = new THREE.Color('#ffffff')
	materialText.emissive = new THREE.Color('#828282')
	//  materialText.flatShading = true
	//  materialText.depthTest = false
	//  materialText.transparent = true
	//  materialText.opacity = 1
	materialText.metalness = 1
	materialText.roughness = 0
	materialText.envMapIntensity = 30
	//  materialText.wireframe = true
	//  materialText.envMap = environmentMap
	//  gui.add(materialText, 'emissiveIntensity').min(0).max(1).step(0.001)
	//  gui.addColor(debugObject, 'emissiveColor').onChange(() => {
	//   materialText.emissive.set(debugObject.emissiveColor)
	//  })

	/**
	 * TEXT INTRO WELCOME
	 */

	const textGeometryHello = new TextGeometry('Nikodev', {
		font,
		size: 0.4,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0.01,
		bevelSegments: 10,
	})

	textGeometryHello.center()

	const textHello = new THREE.Mesh(textGeometryHello, materialText)
	textHello.position.x = -1
	textHello.position.y = 0.5

	const textGeometryWelcome = new TextGeometry('Web3 ThreeJS React', {
		font,
		size: 0.2,
		height: 0.1,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0.001,
		bevelSegments: 10,
	})

	textGeometryWelcome.center()

	const textWelcome = new THREE.Mesh(textGeometryWelcome, materialText)
	textWelcome.position.x = -1
	textWelcome.position.y = 0.1

	const textGroup = new THREE.Group()
	textGroup.add(textWelcome)
	textGroup.add(textHello)
	textGroup.rotation.y = 0.321
	textGroup.position.z = 0

	//  gui.add(textGroup.rotation, 'y').min(0).max(10).step(0.001)
	//  gui.add(textGroup.position, 'z').min(-10).max(10).step(0.001)

	scene.add(textGroup)

	/**
	 * TEXT PROJECTS
	 */

	const textGeometryProjects = new TextGeometry('projects', {
		font,
		size: 0.4,
		height: 0.3,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.01,
		bevelSize: 0.03,
		bevelOffset: 0.015,
		bevelSegments: 4,
	})

	textGeometryProjects.center()

	const textProjects = new THREE.Mesh(textGeometryProjects, materialText)
	textProjects.position.x = 2
	textProjects.position.y = -objectsDistance * 1
	textProjects.rotation.y = Math.PI / -6

	scene.add(textProjects)

	// 2D WORK
	const textGeometry2dWork = new TextGeometry('Static Sites', {
		font,
		size: 0.4,
		height: 0.3,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.01,
		bevelSize: 0.03,
		bevelOffset: 0.015,
		bevelSegments: 4,
	})

	const text2dWork = new THREE.Mesh(textGeometry2dWork, materialText)
	text2dWork.position.x = 8.323
	text2dWork.rotation.y = 3.861
	text2dWork.position.z = 8.394
	text2dWork.position.y = -2.566

	scene.add(text2dWork)

	//3D Work

	const textGeometry3dWork = new TextGeometry('ThreeJS stuff', {
		font,
		size: 0.3,
		height: 0.3,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.01,
		bevelSize: 0.03,
		bevelOffset: 0.015,
		bevelSegments: 4,
	})

	const text3dWork = new THREE.Mesh(textGeometry3dWork, materialText)
	text3dWork.position.x = -3.24
	text3dWork.rotation.y = 2.48
	text3dWork.position.z = 11.39
	text3dWork.position.y = -4.27

	//  gui.add(text3dWork.position, 'x').min(-10).max(10).step(0.01)
	//  gui.add(text3dWork.position, 'y').min(-5).max(5).step(0.01)
	//  gui.add(text3dWork.position, 'z').min(-5).max(15).step(0.01)
	//  gui.add(text3dWork.rotation, 'y').min(-5).max(15).step(0.01)

	scene.add(text3dWork)

	/**
	 * ABOUT
	 */

	const textGeometryResume = new TextGeometry('About', {
		font,
		size: 0.4,
		height: 0.3,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.01,
		bevelSize: 0.03,
		bevelOffset: 0.015,
		bevelSegments: 4,
	})

	textGeometryResume.center()

	const textResume = new THREE.Mesh(textGeometryResume, materialText)
	textResume.position.x = -2
	textResume.position.y = -objectsDistance * 2
	textResume.rotation.y = Math.PI / 6

	scene.add(textResume)
})

/**
 * Post Processing
 */

// renderTarget
const renderTarget = new THREE.WebGLMultisampleRenderTarget(800, 600, {
	minFilter: THREE.LinearFilter,
	magFilter: THREE.LinearFilter,
	format: THREE.RGBAFormat,
	encoding: THREE.sRGBEncoding,
})

//composer
const effectComposer = new EffectComposer(renderer, renderTarget)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

//passes
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const glitchPass = new GlitchPass()
glitchPass.enabled = false
effectComposer.addPass(glitchPass)
// gui.add(glitchPass, 'enabled')

// const unrealBloomPass = new UnrealBloomPass()
// unrealBloomPass.strength = 0.5
// unrealBloomPass.radius = 1
// unrealBloomPass.threshold = 0.6
// unrealBloomPass.enabled = false
// effectComposer.addPass(unrealBloomPass)

// gui.add(unrealBloomPass, 'enabled').name('bloomEnable')
// gui.add(unrealBloomPass, 'strength').min(0).max(3).step(0.001)
// gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.001)
// gui.add(unrealBloomPass, 'threshold').min(0).max(1).step(0.001)

/**
 * Scroll sort out
 */

let scrollY = window.scrollY
let currentSection = 0
const warningText = document.querySelector('.warning')

window.addEventListener('scroll', () => {
	scrollY = window.scrollY
	console.log(scrollY)

	const newSectionLand = Math.round(scrollY / sizes.height)
	console.log(newSectionLand)
	if (newSectionLand != currentSection) {
		currentSection = newSectionLand
		//   console.log('changed', currentSection)

		gsap.to(sectionMeshes[currentSection].rotation, {
			duration: 1.5,
			ease: 'power2.inOut',
			x: '+=6',
			y: '+=3',
		})
	}
	if (newSectionLand == 3) {
		glitchPass.enabled = true
		warningText.classList.remove('hide')
	} else if (newSectionLand != 3) {
		glitchPass.enabled = false
		warningText.classList.add('hide')
	}
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
	/// ADDED TO OOP
	stats.begin()

	const elapsedTime = clock.getElapsedTime()

	const deltaTime = elapsedTime - previousTime
	previousTime = elapsedTime

	// update sphere material
	//  materialSphere.uniforms.uTime.value = elapsedTime

	// update starMaterial
	starMaterial.uniforms.uTime.value = elapsedTime / 10
	starMaterial.uniforms.uSize.value = Math.abs(Math.sin(elapsedTime))
	//  console.log(starMaterial.uniforms.uSize.value)

	// animation of camera
	camera.position.y = (-scrollY / sizes.height) * objectsDistance
	const parallaxX = cursor.x * 2
	const parallaxY = -cursor.y * 2
	//  console.log(parallaxX)
	const parallaxZ = cursor.y * 2
	//  const parallaxXRotation = cursor.x * 1.3

	cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 3 * deltaTime
	cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 3 * deltaTime
	//  cameraGroup.position.z += (parallaxZ - cameraGroup.position.z) * 3 * deltaTime

	//  cameraGroup.rotation.y = (parallaxX - cameraGroup.rotation.y) * 6 * deltaTime

	//  console.log(cameraGroup.rotation.y)
	for (const mesh of sectionMeshes) {
		mesh.rotation.x += deltaTime * 0.03
		mesh.rotation.y += deltaTime * 0.15
	}

	taxleMesh.position.y = -objectsDistance + Math.sin(elapsedTime * 0.3) / 5
	ffgMesh.position.y = -objectsDistance + Math.sin(elapsedTime * 0.8) / 5
	taxleMesh.rotation.y += Math.sin(elapsedTime * 0.8) / 500
	ffgMesh.rotation.y += Math.sin(elapsedTime * 0.8) / 500

	// Render
	//  renderer.render(scene, camera)
	effectComposer.render()
	//  unrealBloomPass.threshold = Math.sin(deltaTime * 0.1)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
	/// ADDED TO OOP
	stats.end()
}

tick()
