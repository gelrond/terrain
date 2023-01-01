// ********************************************************************************************************************
import { IEquality } from "../shared/equality.interface";
// ********************************************************************************************************************
import { Bounds3 } from "./bounds3";
// ********************************************************************************************************************
export class Array3<_TType extends IEquality<_TType>> {

    // ****************************************************************************************************************
    // array - the array
    // ****************************************************************************************************************
    protected readonly array: _TType[][][] = [];

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public readonly sizeX: number, public readonly sizeY: number, public readonly sizeZ: number) {

        for (var x = 0; x < this.sizeX; x++) {

            this.array[x] = [];

            for (var y = 0; y < this.sizeY; y++) {

                this.array[x][y] = [];
            }
        }
    }

    // ****************************************************************************************************************
    // function:    copy
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    //              bounds - the bounds
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public copy(source: Array3<_TType>, bounds: Bounds3 | null = null): void {

        if (source) {

            const x1 = bounds?.min.x ?? 0;

            const x2 = bounds?.max.x ?? this.sizeX - 1;

            const y1 = bounds?.min.y ?? 0;

            const y2 = bounds?.max.y ?? this.sizeY - 1;

            const z1 = bounds?.min.z ?? 0;

            const z2 = bounds?.max.z ?? this.sizeZ - 1;

            for (var x = x1; x <= x2; x++) {

                for (var y = y1; y <= y2; y++) {

                    for (var z = z1; z <= z2; z++) {

                        const value = source.get(x, y, z);

                        if (value) this.set(x, y, z, value);
                    }
                }
            }
        }
    }

    // ****************************************************************************************************************
    // function:    get
    // ****************************************************************************************************************
    // parameters:  x - the x
    // ****************************************************************************************************************
    //              y - the y
    // ****************************************************************************************************************
    //              z - the z
    // ****************************************************************************************************************
    // returns:     the value
    // ****************************************************************************************************************
    public get(x: number, y: number, z: number): _TType {

        if (this.valid(x, y, z)) {

            return this.array[x][y][z];
        }
        return this.array[0][0][0];
    }

    // ****************************************************************************************************************
    // function:    set
    // ****************************************************************************************************************
    // parameters:  x - the x
    // ****************************************************************************************************************
    //              y - the y
    // ****************************************************************************************************************
    //              z - the z
    // ****************************************************************************************************************
    //              value - the value
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public set(x: number, y: number, z: number, value: _TType): void {

        if (this.valid(x, y, z)) {

            this.array[x][y][z] = value;
        }
    }

    // ****************************************************************************************************************
    // function:    valid
    // ****************************************************************************************************************
    // parameters:  x - the x
    // ****************************************************************************************************************
    //              y - the y
    // ****************************************************************************************************************
    //              z - the z
    // ****************************************************************************************************************
    // returns:     whether valid
    // ****************************************************************************************************************
    public valid(x: number, y: number, z: number): boolean {

        if (x < 0) return false;

        if (x >= this.sizeX) return false;

        if (y < 0) return false;

        if (y >= this.sizeY) return false;

        if (z < 0) return false;

        if (z >= this.sizeZ) return false;

        return true;
    }
}