// ********************************************************************************************************************
import { Modifier } from "../modifiers/modifier";
import { TerrainCellGrid } from "../terrain-cell/terrain-cell-grid";
// ********************************************************************************************************************
export class TerrainUpscaleModifier extends Modifier<TerrainCellGrid, TerrainCellGrid> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor() { super(); }

    // ****************************************************************************************************************
    // function:    modify
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modify(source: TerrainCellGrid): TerrainCellGrid {

        const tx = source.sizeX << 1;

        const ty = source.sizeY << 1;

        const target = new TerrainCellGrid(tx, ty);

        for (var x = 0; x < tx; x++) {

            for (var y = 0; y < ty; y++) {

                const src = source.get(x >> 1, y >> 1);

                const tgt = target.get(x, y);

                tgt.height = src.height;
            }
        }
        return target;
    }
}
