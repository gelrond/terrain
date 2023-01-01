// ********************************************************************************************************************
import { max, min } from "../helpers/math.helper";
import { random, randomChance, randomInteger } from "../helpers/random.helper";
import { Modifier } from "../modifiers/modifier";
import { TerrainCellGrid } from "../terrain-cell/terrain-cell-grid";
// ********************************************************************************************************************
export class TerrainShiftModifier extends Modifier<TerrainCellGrid, TerrainCellGrid> {

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
    public modify(source: TerrainCellGrid): TerrainCellGrid {

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
    public modifyPass(source: TerrainCellGrid): TerrainCellGrid {

        const target = new TerrainCellGrid(source.sizeX, source.sizeY);

        for (var x = 0; x < target.sizeX; x++) {

            for (var y = 0; y < target.sizeY; y++) {

                var src = source.get(x, y);

                var tgt = target.get(x, y);

                tgt.height = src.height;

                if (randomChance(this.shift)) {

                    var direction = randomInteger(1, 8);

                    if (direction == 1) src = source.get(x - 1, y - 1);

                    if (direction == 2) src = source.get(x, y - 1);

                    if (direction == 3) src = source.get(x + 1, y - 1);

                    if (direction == 4) src = source.get(x - 1, y);

                    if (direction == 5) src = source.get(x + 1, y);

                    if (direction == 6) src = source.get(x - 1, y + 1);

                    if (direction == 7) src = source.get(x, y + 1);

                    if (direction == 8) src = source.get(x + 1, y + 1);

                    if (src.height < tgt.height) {

                        var minimum = min(src.height, tgt.height);

                        var maximum = max(src.height, tgt.height);

                        tgt.height = random(minimum, maximum);
                    }
                }
            }
        }
        return target;
    }
}
