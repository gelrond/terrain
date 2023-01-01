// ********************************************************************************************************************
import { max } from "../helpers/math.helper";
import { Modifier } from "../modifiers/modifier";
import { TerrainCellGrid } from "../terrain-cell/terrain-cell-grid";
// ********************************************************************************************************************
export class TerrainSmoothModifier extends Modifier<TerrainCellGrid, TerrainCellGrid> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public readonly passes: number = 4, public readonly distance: number = 4) { super(); }

    // ****************************************************************************************************************
    // function:    modify
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modify(source: TerrainCellGrid): TerrainCellGrid {

        const target = new TerrainCellGrid(source.sizeX, source.sizeY);

        const radius = max(1, this.distance >> 1);

        for (var pass = 0; pass < this.passes; pass++) {

            for (var x = 0; x < target.sizeX; x++) {

                for (var y = 0; y < target.sizeY; y++) {

                    const tgt = target.get(x, y);

                    var height = 0; var count = 0;

                    for (var ix = x - radius; ix <= x + radius; ix++) {

                        for (var iy = y - radius; iy <= y + radius; iy++) {

                            if (source.valid(ix, iy)) {

                                const src = source.get(ix, iy);

                                height += src.height; count++;
                            }
                        }
                    }
                    tgt.height = height / count;
                }
            }
        }
        return target;
    }
}
