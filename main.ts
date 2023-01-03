// ********************************************************************************************************************
import { createNoise3D, NoiseFunction3D } from 'simplex-noise';
// ********************************************************************************************************************
import * as THREE from 'three';
// ********************************************************************************************************************
import { FogExp2 } from 'three';
// ********************************************************************************************************************
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// ********************************************************************************************************************
import { ProgressConsole } from './code/progress/progress-console';
// ********************************************************************************************************************
import { TerrainDataProvider } from './code/terrain/terrain-data/terrain-data-provider';
// ********************************************************************************************************************
import { TerrainGeneratorSeed } from './code/terrain/terrain-generators/terrain-generator-seed';
// ********************************************************************************************************************
import { TerrainModifierBiomizer } from './code/terrain/terrain-modifiers/terrain-modifier-biomizer';
// ********************************************************************************************************************
import { TerrainModifierNormalize } from './code/terrain/terrain-modifiers/terrain-modifier-normalize';
// ********************************************************************************************************************
import { TerrainModifierShift } from './code/terrain/terrain-modifiers/terrain-modifier-shift';
// ********************************************************************************************************************
import { TerrainModifierSmooth } from './code/terrain/terrain-modifiers/terrain-modifier-smooth';
// ********************************************************************************************************************
import { TerrainModifierUpscale } from './code/terrain/terrain-modifiers/terrain-modifier-upscale';
// ********************************************************************************************************************
import { TerrainPatchGrid } from './code/terrain/terrain-patch-grid';
// ********************************************************************************************************************

// ********************************************************************************************************************
// progress
// ********************************************************************************************************************
const progress = new ProgressConsole(25);

// ********************************************************************************************************************
// noise
// ********************************************************************************************************************
const noise: NoiseFunction3D = createNoise3D();

// ********************************************************************************************************************
// scene & renderer
// ********************************************************************************************************************
const scene = new THREE.Scene();

scene.background = new THREE.Color('#333333');

scene.fog = new FogExp2('#a0a0a0', 0.001)

const renderer = new THREE.WebGLRenderer();

// ********************************************************************************************************************
// camera
// ********************************************************************************************************************
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);

camera.position.y = 200; camera.position.z = 256;

new OrbitControls(camera, renderer.domElement);

// ********************************************************************************************************************
// lighting
// ********************************************************************************************************************
const sun = new THREE.DirectionalLight('#f0f0e0', 1.0);

sun.position.z = -100; sun.position.y = 64;

scene.add(sun);

// ********************************************************************************************************************
// ocean
// ********************************************************************************************************************
const oceanGeometry = new THREE.PlaneGeometry(1024, 1024, 256, 256);

oceanGeometry.rotateX(THREE.MathUtils.degToRad(-90));

const oceanMaterial = new THREE.MeshStandardMaterial({ color: '#3366a0', envMapIntensity: 4, roughness: 0.33, metalness: 0, transparent: true, opacity: 0.33, wireframe: false });

const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);

var oceanPass = 0;

ocean.position.y = 8;

// scene.add(ocean);

setTimeout(() => {

    // ****************************************************************************************************************
    // terrain generation
    // ****************************************************************************************************************

    var terrainGrid = new TerrainGeneratorSeed(progress).generate();

    while (terrainGrid.sizeX < 1024) {

        terrainGrid = new TerrainModifierUpscale(progress).modify(terrainGrid);

        terrainGrid = new TerrainModifierShift(progress).modify(terrainGrid);
    }
    terrainGrid = new TerrainModifierSmooth(progress).modify(terrainGrid);

    terrainGrid = new TerrainModifierNormalize(progress).modify(terrainGrid);

    terrainGrid = new TerrainModifierBiomizer(progress).modify(terrainGrid);

    const terrainProvider = new TerrainDataProvider(terrainGrid);

    // ****************************************************************************************************************
    // terrain
    // *****************************************************************************************************************

    const terrain = new TerrainPatchGrid(32, 32, 50);

    terrain.create(scene, terrainProvider, progress);

}, 500);

// ********************************************************************************************************************
// initialise
// ********************************************************************************************************************
function initialise() {

    addEventListener('resize', resize);

    document.body.appendChild(renderer.domElement);

    resize();

    update();
}

// ********************************************************************************************************************
// resize
// ********************************************************************************************************************
function resize() {

    camera.aspect = window.innerWidth / window.innerHeight;

    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ********************************************************************************************************************
// update
// ********************************************************************************************************************
function update() {

    requestAnimationFrame(update);

    renderer.render(scene, camera);

    updateOcean();
}

// ********************************************************************************************************************
// updateOcean
// ********************************************************************************************************************
function updateOcean() {

    const positions = oceanGeometry.getAttribute('position');

    for (var i = 0; i < positions.count; i++) {

        const x = positions.getX(i);

        const z = positions.getZ(i);

        const noise1 = noise(x / 4, z / 4, oceanPass) * 0.1;

        const noise2 = noise(x / 32, z / 32, oceanPass) * 0.1;

        const height = (noise1 + noise2) * 4;

        positions.setY(i, height);
    }
    oceanPass += 0.005;

    oceanGeometry.computeVertexNormals();

    oceanGeometry.attributes.position.needsUpdate = true;
}

initialise();
