// ********************************************************************************************************************
import { Colour } from "../../types/colour";
// ********************************************************************************************************************
export enum Biomes { UNKNOWN, SEA_BED, BEACH, BEACH_HEAD, PLAIN, GRASS_LAND, FOREST, MOUNTAIN, ICE_CAP }
// ********************************************************************************************************************
export class TerrainData {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public height: number = 0, public biome: Biomes = Biomes.UNKNOWN) { }

    // ****************************************************************************************************************
    // function:    getBiomeColour
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the biome colour
    // ****************************************************************************************************************
    public getBiomeColour(): Colour {

        switch (this.biome) {

            case Biomes.ICE_CAP: return new Colour(1, 1, 1);

            case Biomes.MOUNTAIN: return new Colour(0.5, 0.5, 0.5);

            case Biomes.FOREST: return new Colour(0.30, 0.45, 0.2);

            case Biomes.GRASS_LAND: return new Colour(0, 0.6, 0);

            case Biomes.PLAIN: return new Colour(0.6, 0.5, 0.3);

            case Biomes.BEACH_HEAD: return new Colour(0.85, 0.7, 0.4);

            case Biomes.BEACH: return new Colour(0.85, 0.75, 0.6);

            case Biomes.SEA_BED: return new Colour(0.85, 0.5, 0.3);
        }
        return new Colour();
    }

    // ****************************************************************************************************************
    // function:    getGreyscaleColour
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the greyscale colour
    // ****************************************************************************************************************
    public getGreyscaleColour(): Colour {

        return new Colour(this.height, this.height, this.height);
    }
}
