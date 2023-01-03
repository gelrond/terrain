// ********************************************************************************************************************
import { max, min } from "../../helpers/math.helper";
import { random, randomChance, randomInteger } from "../../helpers/random.helper";
import { Modifier } from "../../modifiers/modifier";
import { TerrainDataGrid } from "../terrain-data/terrain-data-grid";
// ********************************************************************************************************************
export class TerrainModifierShift extends Modifier<TerrainDataGrid, TerrainDataGrid> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public readonly shift: number = 0.33, public readonly passes: number = 5) { super(); }

    // ****************************************************************************************************************
    // function:    modify
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modify(source: TerrainDataGrid): TerrainDataGrid {

        for (var pass = 0; pass < this.passes; pass++) {

            source = this.modifyPass(source);
        }
        return source;
    }

    // ****************************************************************************************************************
    // function:    modifyPass
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modifyPass(source: TerrainDataGrid): TerrainDataGrid {

        const target = new TerrainDataGrid(source.sizeX, source.sizeY);

        const sx = 1; const ex = source.sizeX - 2;

        const sy = 1; const ey = source.sizeY - 2;

        for (var x = 0; x < source.sizeX; x++) {

            for (var y = 0; y < source.sizeY; y++) {

                var src = source.get(x, y);

                var tgt = target.get(x, y);

                tgt.height = src.height;

                // ****************************************************************************************************
                // check not on edge
                // ****************************************************************************************************

                if (x >= sx && x <= ex && y >= sy && y <= ey) {

                    if (randomChance(this.shift)) {

                        // ********************************************************************************************
                        // find neighbour height
                        // ********************************************************************************************

                        var direction = randomInteger(1, 8);

                        if (direction == 1) src = source.get(x - 1, y - 1);

                        if (direction == 2) src = source.get(x, y - 1);

                        if (direction == 3) src = source.get(x + 1, y - 1);

                        if (direction == 4) src = source.get(x - 1, y);

                        if (direction == 5) src = source.get(x + 1, y);

                        if (direction == 6) src = source.get(x - 1, y + 1);

                        if (direction == 7) src = source.get(x, y + 1);

                        if (direction == 8) src = source.get(x + 1, y + 1);

                        // ********************************************************************************************
                        // shift randomly between minimum and maximum height if lower
                        // ********************************************************************************************

                        if (src.height < tgt.height) {

                            var minimum = min(src.height, tgt.height);

                            var maximum = max(src.height, tgt.height);

                            tgt.height = random(minimum, maximum);
                        }
                    }
                }
            }
        }
        return target;
    }
}
