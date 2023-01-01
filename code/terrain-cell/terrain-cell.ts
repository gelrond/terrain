// ********************************************************************************************************************
import { IEquality } from "../shared/equality.interface";
import { Colour } from "../types/colour";
// ********************************************************************************************************************
enum Biomes { UNKNOWN, SEA_BED, BEACH, BEACH_HEAD, PLAIN, GRASS_LAND, FOREST, MOUNTAIN, ICE_CAP }
// ********************************************************************************************************************
export class TerrainCell implements IEquality<TerrainCell> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public height: number = 0, public biome: Biomes = Biomes.UNKNOWN) { }

    // ****************************************************************************************************************
    // function:    equals
    // ****************************************************************************************************************
    // parameters:  other - the other
    // ****************************************************************************************************************
    // returns:     whether equal
    // ****************************************************************************************************************
    public equals(other: TerrainCell): boolean {

        if (other) {

            var equals = (this.height === other.height);

            if (equals) equals = (this.biome === other.biome);

            return equals;
        }
        return false;
    }

    // ****************************************************************************************************************
    // function:    getBiomeColour
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the biome colour
    // ****************************************************************************************************************
    public getBiomeColour(): Colour {

        switch (this.biome) {

            case Biomes.ICE_CAP: return new Colour(255, 255, 255);

            case Biomes.MOUNTAIN: return new Colour(128, 128, 128);

            case Biomes.FOREST: return new Colour(80, 110, 50);

            case Biomes.GRASS_LAND: return new Colour(10, 160, 0);

            case Biomes.PLAIN: return new Colour(150, 140, 70);

            case Biomes.BEACH_HEAD: return new Colour(220, 180, 100);

            case Biomes.BEACH: return new Colour(200, 190, 150);

            case Biomes.SEA_BED: return new Colour(90, 200, 220);
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
