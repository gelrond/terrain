// ********************************************************************************************************************
import { Mesh, Scene } from 'three';
import { IProgress } from '../progress/progress.interface';
import { Vector2 } from '../types/vector2';
import { TerrainPatch } from './terrain-patch';
import { ITerrainProvider } from './terrain-provider.interface';
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
    //              provider - the provider
    // ****************************************************************************************************************
    //              progress - the progress
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public create(scene: Scene, provider: ITerrainProvider, progress: IProgress): void {

        // ************************************************************************************************************
        // setup variables
        // ************************************************************************************************************

        const patchSizeHalf = this.patchSize >> 1;

        const totalSize = this.patchesPerSide * this.patchSize;

        const totalSizeHalf = totalSize >> 1;

        const totalPatches = this.patchesPerSide * this.patchesPerSide;

        const patches: TerrainPatch[][] = [];

        // ************************************************************************************************************
        // setup patches
        // ************************************************************************************************************

        progress.begin(totalPatches, 'Creating Patches', 1);

        for (var x = 0; x < this.patchesPerSide; x++) {

            patches[x] = [];

            for (var y = 0; y < this.patchesPerSide; y++) {

                progress.next();

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

                patches[x][y] = new TerrainPatch(pointNw, pointNe, pointSw, pointSe, provider);
            }
        }

        // ************************************************************************************************************
        // setup neighbours
        // ************************************************************************************************************

        progress.begin(totalPatches, 'Linking & Tesselating', 1);

        for (var x = 0; x < this.patchesPerSide; x++) {

            for (var y = 0; y < this.patchesPerSide; y++) {

                progress.next();

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

        progress.begin(totalPatches, 'Creating Geometry', 1);

        for (var x = 0; x < this.patchesPerSide; x++) {

            for (var y = 0; y < this.patchesPerSide; y++) {

                progress.next();

                const patch = patches[x][y];

                const geometry = patch.createGeometry(this.ceiling);

                const material = patch.createMaterial();

                const mesh = new Mesh(geometry, material);

                scene.add(mesh);
            }
        }
    }
}
