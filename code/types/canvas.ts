// ********************************************************************************************************************
import * as THREE from 'three';
import { clamp } from '../helpers/math.helper';
import { Colour } from "./colour";
// ********************************************************************************************************************
export class Canvas {

    // ****************************************************************************************************************
    // data - the data
    // ****************************************************************************************************************
    private data: ImageData;

    // ****************************************************************************************************************
    // offsets - the offsets
    // ****************************************************************************************************************
    private offsets: number[][] = [];

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public readonly sizeX: number, public readonly sizeY: number) {

        this.data = new ImageData(sizeX, sizeY);

        for (var x = 0; x < sizeX; x++) {

            this.offsets[x] = [];

            for (var y = 0; y < sizeY; y++) {

                this.offsets[x][y] = ((y * sizeY) * 4) + (x * 4);
            }
        }
    }

    // ****************************************************************************************************************
    // function:    getOffset
    // ****************************************************************************************************************
    // parameters:  x - the x
    // ****************************************************************************************************************
    //              y - the y
    // ****************************************************************************************************************
    // returns:     the offset
    // ****************************************************************************************************************
    private getOffset(x: number, y: number): number {

        x = clamp(x, 0, this.sizeX - 1);

        y = clamp(y, 0, this.sizeY - 1);

        return this.offsets[x][y];
    }

    // ****************************************************************************************************************
    // function:    getTexture
    // ****************************************************************************************************************
    // parameters:  wrapping - the wrapping
    // ****************************************************************************************************************
    // returns:     the texture
    // ****************************************************************************************************************
    public getTexture(wrapping: THREE.Wrapping = THREE.MirroredRepeatWrapping): THREE.Texture {

        const canvas = document.createElement('canvas');

        const context = canvas.getContext('2d');

        if (context) {

            canvas.width = this.sizeX; canvas.height = this.sizeY;

            context.putImageData(this.data, 0, 0);

            return new THREE.CanvasTexture(context.canvas, THREE.UVMapping, wrapping, wrapping);
        }
        return new THREE.Texture();
    }

    // ****************************************************************************************************************
    // function:    setPixel
    // ****************************************************************************************************************
    // parameters:  x - the x
    // ****************************************************************************************************************
    //              y - the y
    // ****************************************************************************************************************
    //              colour - the colour
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public setPixel(x: number, y: number, colour: Colour): void {

        var offset = this.getOffset(x, y);

        if (offset >= 0) {

            this.data.data[offset++] = clamp(colour.r * 255, 0, 255);

            this.data.data[offset++] = clamp(colour.g * 255, 0, 255);

            this.data.data[offset++] = clamp(colour.b * 255, 0, 255);

            this.data.data[offset++] = clamp(colour.a * 255, 0, 255);
        }
    }
}
