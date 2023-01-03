// ********************************************************************************************************************
import { max } from "../../helpers/math.helper";
import { Modifier } from "../../modifiers/modifier";
import { TerrainCellGrid } from "../terrain-cell/terrain-cell-grid";
// ********************************************************************************************************************
export class TerrainModifierSmooth extends Modifier<TerrainCellGrid, TerrainCellGrid> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public readonly passes: number = 1, public readonly distance: number = 3) { super(); }

    // ****************************************************************************************************************
    // function:    modify
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modify(source: TerrainCellGrid): TerrainCellGrid {

        const radius = max(1, this.distance >> 1);

        for (var pass = 0; pass < this.passes; pass++) {

            source = this.modifyPass(source, radius);
        }
        return source;
    }

    // ****************************************************************************************************************
    // function:    modifyPass
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    //              radius - the radius
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modifyPass(source: TerrainCellGrid, radius: number): TerrainCellGrid {

        const target = new TerrainCellGrid(source.sizeX, source.sizeY);

        for (var x = 0; x < source.sizeX; x++) {

            for (var y = 0; y < source.sizeY; y++) {

                var height = 0, count = 0;

                for (var ix = x - radius; ix <= x + radius; ix++) {

                    for (var iy = y - radius; iy <= y + radius; iy++) {

                        if (source.valid(ix, iy)) {

                            const src = source.get(ix, iy);

                            height += src.height; count++;
                        }
                    }
                }
                const tgt = target.get(x, y);

                tgt.height = height / count;
            }
        }
        return target;
    }
}
