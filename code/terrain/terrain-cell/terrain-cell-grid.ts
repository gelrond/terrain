// ********************************************************************************************************************
import { Array2 } from "../../types/array2";
import { TerrainCell } from "./terrain-cell";
// ********************************************************************************************************************
export class TerrainCellGrid extends Array2<TerrainCell> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(sizeX: number, sizeY: number) {

        super(sizeX, sizeY);

        for (var x = 0; x < this.sizeX; x++) {

            for (var y = 0; y < this.sizeY; y++) {

                this.array[x][y] = new TerrainCell(0);
            }
        }
    }

    // ****************************************************************************************************************
    // function:    clone
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the clone
    // ****************************************************************************************************************
    public clone(): TerrainCellGrid {

        const clone = new TerrainCellGrid(this.sizeX, this.sizeY);

        clone.copy(this);

        return clone;
    }
}
