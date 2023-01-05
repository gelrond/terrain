// ********************************************************************************************************************
import { Color, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
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
import { TerrainProvider } from './code/terrain/terrain-provider';
// ********************************************************************************************************************

const usingGenerator: boolean = false;

// ********************************************************************************************************************
// progress
// ********************************************************************************************************************
const progress = new ProgressConsole(25);

// ********************************************************************************************************************
// scene & renderer
// ********************************************************************************************************************
const scene = new Scene();

scene.background = new Color('#333333');

const renderer = new WebGLRenderer({ antialias: true });

// ********************************************************************************************************************
// camera
// ********************************************************************************************************************
const camera = new PerspectiveCamera(50, 1, 0.1, 2000);

camera.position.y = 200; camera.position.z = 256;

new OrbitControls(camera, renderer.domElement);

// ********************************************************************************************************************
// lighting
// ********************************************************************************************************************
const sun = new DirectionalLight('#f0f0d0', 1.0);

sun.position.z = -1; sun.position.y = 1;

scene.add(sun);

// ********************************************************************************************************************
// terrain generation
// ********************************************************************************************************************
var terrainGrid = new TerrainGeneratorSeed(progress).generate();

if (usingGenerator) {

    while (terrainGrid.sizeX < 512) {

        terrainGrid = new TerrainModifierUpscale(progress).modify(terrainGrid);

        terrainGrid = new TerrainModifierShift(progress).modify(terrainGrid);
    }
    terrainGrid = new TerrainModifierSmooth(progress).modify(terrainGrid);

    terrainGrid = new TerrainModifierNormalize(progress).modify(terrainGrid);

    terrainGrid = new TerrainModifierBiomizer(progress).modify(terrainGrid);

    const terrainProvider = new TerrainDataProvider(terrainGrid);

    const terrain = new TerrainPatchGrid(32, 32, 40);

    terrain.create(scene, terrainProvider, progress);
} else {
    const terrainProvider = new TerrainProvider();

    const terrain = new TerrainPatchGrid(32, 32, 40);

    terrain.create(scene, terrainProvider, progress);
}

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
}
initialise();
