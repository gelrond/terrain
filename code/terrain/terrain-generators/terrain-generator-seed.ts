// ********************************************************************************************************************
import { Generator } from "../../generators/generator";
// ********************************************************************************************************************
import { random, randomInteger } from "../../helpers/random.helper";
// ********************************************************************************************************************
import { IProgress } from "../../progress/progress.interface";
// ********************************************************************************************************************
import { TerrainDataGrid } from "../terrain-data/terrain-data-grid";
// ********************************************************************************************************************
export class TerrainGeneratorSeed extends Generator<TerrainDataGrid> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public readonly progress: IProgress, public readonly size: number = 8, public readonly coverage: number = 0.95, public readonly max: number = 1, public readonly min: number = 0.5, public readonly edge: number = 0) { super(); }

    // ****************************************************************************************************************
    // function:    generate
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public generate(): TerrainDataGrid {

        // ************************************************************************************************************
        // setup variables
        // ************************************************************************************************************

        const target = new TerrainDataGrid(this.size, this.size);

        const inner = this.size - (this.edge << 1);

        const coverage = (this.coverage * inner * inner);

        this.progress.begin(coverage, 'Seeding');

        // ************************************************************************************************************
        // keep seeding until coverage reached
        // ************************************************************************************************************

        for (var pass = 0; pass < coverage;) {

            const x = randomInteger(this.edge, this.size - this.edge)

            const y = randomInteger(this.edge, this.size - this.edge)

            const tgt = target.get(x, y);

            if (tgt.height > 0) continue;

            tgt.height = random(this.min, this.max);

            this.progress.next();

            pass++;
        }
        return target;
    }
}
