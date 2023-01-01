// ********************************************************************************************************************
import { Mesh, MeshStandardMaterial, Scene } from 'three';
// ********************************************************************************************************************
import { Vector2 } from '../types/vector2';
// ********************************************************************************************************************
import { ITerrainHeights } from './terrain-heights.interface';
// ********************************************************************************************************************
import { TerrainPatch } from './terrain-patch';
// ********************************************************************************************************************
export class TerrainPatchGrid {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(private readonly patchesPerSide: number, private readonly patchSize: number, private readonly ceiling: number) { }

    // ****************************************************************************************************************
    // function:    create
    // ****************************************************************************************************************
    // parameters:  scene - the scene
    // ****************************************************************************************************************
    //              heights - the heights
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public create(scene: Scene, heights: ITerrainHeights): void {

        // ************************************************************************************************************
        // setup process
        // ************************************************************************************************************

        const patchSizeHalf = this.patchSize >> 1;

        const totalSize = this.patchesPerSide * this.patchSize;

        const totalSizeHalf = totalSize >> 1;

        const patches: TerrainPatch[][] = [];

        // ************************************************************************************************************
        // setup patches
        // ************************************************************************************************************

        for (var x = 0; x < this.patchesPerSide; x++) {

            patches[x] = [];

            for (var y = 0; y < this.patchesPerSide; y++) {

                // ****************************************************************************************************
                // obtain center
                // ****************************************************************************************************

                const cx = (x * this.patchSize) - totalSizeHalf;

                const cy = (y * this.patchSize) - totalSizeHalf;

                // ****************************************************************************************************
                // obtain points
                // ****************************************************************************************************

                const pointNw = new Vector2(cx - patchSizeHalf, cy - patchSizeHalf);

                const pointNe = new Vector2(cx + patchSizeHalf, cy - patchSizeHalf);

                const pointSw = new Vector2(cx - patchSizeHalf, cy + patchSizeHalf);

                const pointSe = new Vector2(cx + patchSizeHalf, cy + patchSizeHalf);

                // ****************************************************************************************************
                // obtain patch
                // ****************************************************************************************************

                patches[x][y] = new TerrainPatch(pointNw, pointNe, pointSw, pointSe, heights);
            }
        }

        // ************************************************************************************************************
        // setup neighbours
        // ************************************************************************************************************

        for (var x = 0; x < this.patchesPerSide; x++) {

            for (var y = 0; y < this.patchesPerSide; y++) {

                const patch = patches[x][y];

                const north: TerrainPatch | null = y > 0 ? patches[x][y - 1] : null;

                const east: TerrainPatch | null = x < this.patchesPerSide - 1 ? patches[x + 1][y] : null;

                const south: TerrainPatch | null = y < this.patchesPerSide - 1 ? patches[x][y + 1] : null;

                const west: TerrainPatch | null = x > 0 ? patches[x - 1][y] : null;

                patch.setNeighbours(north, east, south, west);

                patch.tesselate();
            }
        }

        // ************************************************************************************************************
        // setup mesh
        // ************************************************************************************************************

        for (var x = 0; x < this.patchesPerSide; x++) {

            for (var y = 0; y < this.patchesPerSide; y++) {

                const patch = patches[x][y];

                const normalMap = patch.createNormalMap();

                const material = new MeshStandardMaterial({ color: '#33a063', roughness: 1.0, normalMap: normalMap, normalScale: new Vector2(2, 2), wireframe: true })

                const geometry = patch.createGeometry(this.ceiling);

                geometry.computeVertexNormals();

                const mesh = new Mesh(geometry, material);

                scene.add(mesh);
            }
        }
    }
}
