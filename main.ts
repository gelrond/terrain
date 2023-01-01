// ********************************************************************************************************************
import { createNoise3D, NoiseFunction3D } from 'simplex-noise';
// ********************************************************************************************************************
import * as THREE from 'three';
// ********************************************************************************************************************
import { FogExp2 } from 'three';
// ********************************************************************************************************************
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// ********************************************************************************************************************
// import { TerrainGeneratorSeed } from './code/terrain-generation/terrain-generator-seed';
// ********************************************************************************************************************
import { TerrainCellGridHeights } from './code/terrain-generation/terrain-cell-grid-heights';
// ********************************************************************************************************************
import { TerrainGeneratorSimplex } from './code/terrain-generation/terrain-generator-simplex';
// ********************************************************************************************************************
// import { TerrainModifierUpscale } from './code/terrain-generation/terrain-modifier-upscale';
// ********************************************************************************************************************
// import { TerrainHeights } from './code/terrain/terrain-heights';
// ********************************************************************************************************************
import { TerrainPatchGrid } from './code/terrain/terrain-patch-grid';
// ********************************************************************************************************************

// ********************************************************************************************************************

const scene = new THREE.Scene();

scene.background = new THREE.Color('#333333');

scene.fog = new FogExp2('#a0a0a0', 0.002)

const renderer = new THREE.WebGLRenderer();

// const grid = new THREE.GridHelper(512, 256, new THREE.Color('#333344'), new THREE.Color('#111111'));

// scene.add(grid);

// ********************************************************************************************************************

const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 2000);

camera.position.y = 200; camera.position.z = 256;

new OrbitControls(camera, renderer.domElement);

// ********************************************************************************************************************

const sun = new THREE.DirectionalLight('#f0f0e0', 1.0);

sun.position.z = -100; sun.position.y = 64;

scene.add(sun);

// ********************************************************************************************************************

const ocean_g = new THREE.PlaneGeometry(512, 512, 256, 256);

ocean_g.rotateX(THREE.MathUtils.degToRad(-90));

const ocean_m = new THREE.MeshStandardMaterial({ color: '#3366a0', roughness: 0.0, metalness: 0, wireframe: true });

const ocean = new THREE.Mesh(ocean_g, ocean_m);

ocean.position.y = 16;

// scene.add(ocean);

// ********************************************************************************************************************

var grid = new TerrainGeneratorSimplex().generate();
/*
grid = new TerrainModifierUpscale().modify(grid);
grid = new TerrainModifierUpscale().modify(grid);
grid = new TerrainModifierUpscale().modify(grid);
grid = new TerrainModifierUpscale().modify(grid);
grid = new TerrainModifierUpscale().modify(grid);
*/
const heights = new TerrainCellGridHeights(grid);

const patches = new TerrainPatchGrid(16, 32, 64);

patches.create(scene, heights);

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
var pass = 0;
const noise: NoiseFunction3D = createNoise3D();
// ********************************************************************************************************************
function updateOcean() {

    const positions = ocean_g.getAttribute('position');

    for (var c = 0; c < positions.count; c++) {

        const x = positions.getX(c);

        const y = positions.getZ(c);

        const n1 = noise(x / 4, y / 4, pass) * 0.1;

        const n2 = noise(x / 32, y / 32, pass) * 0.1;

        const he = (n1 + n2) * 4;

        positions.setY(c, he);
    }
    pass += 0.005;

    ocean_g.computeVertexNormals();

    ocean_g.attributes.position.needsUpdate = true;

}
initialise();
