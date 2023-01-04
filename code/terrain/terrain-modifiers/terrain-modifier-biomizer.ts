// ********************************************************************************************************************
import { randomChance } from "../../helpers/random.helper";
import { Modifier } from "../../modifiers/modifier";
// ********************************************************************************************************************
import { IProgress } from "../../progress/progress.interface";
// ********************************************************************************************************************
import { Biomes } from "../terrain-data/terrain-data";
// ********************************************************************************************************************
import { TerrainDataGrid } from "../terrain-data/terrain-data-grid";
// ********************************************************************************************************************
export class TerrainModifierBiomizer extends Modifier<TerrainDataGrid, TerrainDataGrid> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public readonly progress: IProgress) { super(); }

    // ****************************************************************************************************************
    // function:    modify
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modify(source: TerrainDataGrid): TerrainDataGrid {

        this.progress.begin(source.total, 'Biomizing');

        for (var x = 0; x < source.sizeX; x++) {

            for (var y = 0; y < source.sizeY; y++) {

                var src = source.get(x, y);

                // ****************************************************************************************************
                // calculate biome 
                // ****************************************************************************************************

                src.biome = Biomes.SEA_BED;

                if (src.height >= 0.10 && randomChance(0.2)) src.biome = Biomes.BEACH;

                if (src.height >= 0.20 && randomChance(0.2)) src.biome = Biomes.BEACH_HEAD;

                if (src.height >= 0.25 && randomChance(0.2)) src.biome = Biomes.PLAIN;

                if (src.height >= 0.30 && randomChance(0.2)) src.biome = Biomes.GRASS_LAND;

                if (src.height >= 0.40 && randomChance(0.2)) src.biome = Biomes.FOREST;

                if (src.height >= 0.50 && randomChance(0.2)) src.biome = Biomes.MOUNTAIN;

                if (src.height >= 0.60 && randomChance(0.2)) src.biome = Biomes.ICE_CAP;

                this.progress.next();
            }
        }
        return source;
    }
}
