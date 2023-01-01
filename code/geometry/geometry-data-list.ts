// ********************************************************************************************************************
import { Colour } from "../types/colour";
import { List } from "../types/list";
import { Vector2 } from "../types/vector2";
import { Vector3 } from "../types/vector3";
import { GeometryData } from "./geometry-data";
// ********************************************************************************************************************
export class GeometryDataList extends List<GeometryData> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(data: GeometryData[] = []) { super(data); }

    // ****************************************************************************************************************
    // function:    getColours
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the colours
    // ****************************************************************************************************************
    public getColours(): Colour[] {

        const colours = [];

        for (const data of this.array) {

            if (data.colour) colours.push(data.colour);
        }
        return colours;
    }

    // ****************************************************************************************************************
    // function:    getColoursArray
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the colours array
    // ****************************************************************************************************************
    public getColoursArray(): Float32Array {

        const colours: number[] = [];

        for (const colour of this.getColours()) {

            colours.push(...[colour.r, colour.g, colour.b]);
        }
        return new Float32Array(colours);
    }

    // ****************************************************************************************************************
    // function:    getNormals
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the normals
    // ****************************************************************************************************************
    public getNormals(): Vector3[] {

        const normals = [];

        for (const data of this.array) {

            if (data.normal) normals.push(data.normal);
        }
        return normals;
    }

    // ****************************************************************************************************************
    // function:    getNormalsArray
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the normals array
    // ****************************************************************************************************************
    public getNormalsArray(): Float32Array {

        const normals: number[] = [];

        for (const normal of this.getNormals()) {

            normals.push(...[normal.x, normal.y, normal.z]);
        }
        return new Float32Array(normals);
    }

    // ****************************************************************************************************************
    // function:    getPositions
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the positions
    // ****************************************************************************************************************
    public getPositions(): Vector3[] {

        const positions = [];

        for (const data of this.array) {

            if (data.position) positions.push(data.position);
        }
        return positions;
    }

    // ****************************************************************************************************************
    // function:    getPositionsArray
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the positions array
    // ****************************************************************************************************************
    public getPositionsArray(): Float32Array {

        const positions: number[] = [];

        for (const position of this.getPositions()) {

            positions.push(...[position.x, position.y, position.z]);
        }
        return new Float32Array(positions);
    }

    // ****************************************************************************************************************
    // function:    getUvs
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the uvs
    // ****************************************************************************************************************
    public getUvs(): Vector2[] {

        const uvs = [];

        for (const data of this.array) {

            if (data.uv) uvs.push(data.uv);
        }
        return uvs;
    }

    // ****************************************************************************************************************
    // function:    getUvsArray
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the uvs array
    // ****************************************************************************************************************
    public getUvsArray(): Float32Array {

        const uvs: number[] = [];

        for (const uv of this.getUvs()) {

            uvs.push(...[uv.x, uv.y]);
        }
        return new Float32Array(uvs);
    }

    // ****************************************************************************************************************
    // function:    getUv2s
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the uv2s
    // ****************************************************************************************************************
    public getUv2s(): Vector2[] {

        const uv2s = [];

        for (const data of this.array) {

            if (data.uv2) uv2s.push(data.uv2);
        }
        return uv2s;
    }

    // ****************************************************************************************************************
    // function:    getUv2sArray
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the uv2s array
    // ****************************************************************************************************************
    public getUv2sArray(): Float32Array {

        const uv2s: number[] = [];

        for (const uv2 of this.getUv2s()) {

            uv2s.push(...[uv2.x, uv2.y]);
        }
        return new Float32Array(uv2s);
    }
}
