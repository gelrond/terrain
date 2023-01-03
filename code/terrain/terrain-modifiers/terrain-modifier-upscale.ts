// ********************************************************************************************************************
import { Modifier } from "../../modifiers/modifier";
import { TerrainDataGrid } from "../terrain-data/terrain-data-grid";
// ********************************************************************************************************************
export class TerrainModifierUpscale extends Modifier<TerrainDataGrid, TerrainDataGrid> {

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
    public modify(source: TerrainDataGrid): TerrainDataGrid {

        const tx = source.sizeX << 1;

        const ty = source.sizeY << 1;

        const target = new TerrainDataGrid(tx, ty);

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
