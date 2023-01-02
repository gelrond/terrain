// ********************************************************************************************************************
import { abs, clampZeroOne, sqrt } from "../../helpers/math.helper";
// ********************************************************************************************************************
export class TerrainModifierWeights {

    // ****************************************************************************************************************
    // function:    generate
    // ****************************************************************************************************************
    // parameters:  radius - the radius
    // ****************************************************************************************************************
    // returns:     the weights
    // ****************************************************************************************************************
    public static generate(radius: number): number[][] {

        // ************************************************************************************************************
        // setup variables
        // ************************************************************************************************************

        const weights: number[][] = [];

        var size = radius << 1, total = 0, sx = 0, sy = 0;

        // ************************************************************************************************************
        // setup weights
        // ************************************************************************************************************

        for (var x = 0; x < size; x++, sx = x * x) {

            weights[x] = [];

            for (var y = 0; y < size; y++, sy = y * y) {

                const distance = sqrt(sx + sy);

                weights[x][y] = abs(1 - (distance / radius));

                total += weights[x][y];
            }
        }

        // ************************************************************************************************************
        // setup weights normalized
        // ************************************************************************************************************

        for (var x = 0; x < size; x++) {

            for (var y = 0; y < size; y++) {

                weights[x][y] = clampZeroOne(weights[x][y] / total);
            }
        }
        return weights;
    }
}