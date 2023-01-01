// ********************************************************************************************************************
import { Mesh, Scene } from 'three';
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
        // setup variables
        // ************************************************************************************************************

        const patchSizeHalf = this.patchSize >> 1;

        const totalSize = this.patchesPerSide * this.patchSize;

        const totalSizeHalf = totalSize >> 1;

        const patches: TerrainPatch[][] = [];

        // ************************************************************************************************************
        // traverse grid
        // ************************************************************************************************************

        for (var x = 0; x < this.patchesPerSide; x++) {

            patches[x] = [];

            for (var y = 0; y < this.patchesPerSide; y++) {

                // ****************************************************************************************************
                // obtain origin
                // ****************************************************************************************************

                const ox = (x * this.patchSize) - totalSizeHalf;

                const oy = (y * this.patchSize) - totalSizeHalf;

                // ****************************************************************************************************
                // obtain points
                // ****************************************************************************************************

                const pointNw = new Vector2(ox - patchSizeHalf, oy - patchSizeHalf);

                const pointNe = new Vector2(ox + patchSizeHalf, oy - patchSizeHalf);

                const pointSw = new Vector2(ox - patchSizeHalf, oy + patchSizeHalf);

                const pointSe = new Vector2(ox + patchSizeHalf, oy + patchSizeHalf);

                // ****************************************************************************************************
                // create patch
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

                const material = patch.createMaterial();

                const geometry = patch.createGeometry(this.ceiling);

                geometry.computeVertexNormals();

                const mesh = new Mesh(geometry, material);

                scene.add(mesh);
            }
        }
    }
}
