// ********************************************************************************************************************
import { Colour } from "../types/colour";
import { Vector2 } from "../types/vector2";
import { Vector3 } from "../types/vector3";
import { ITerrainVariance } from "./terrain-variance.interface";
// ********************************************************************************************************************
export interface ITerrainHeights {
    getColour(x: number, y: number): Colour;
    getGradient(x: number, y: number): Vector2;
    getHeight(x: number, y: number): number;
    getNormal(x: number, y: number): Vector3;
    getVariance(x1: number, y1: number, x2: number, y2: number, limiter: number): ITerrainVariance | null;
}
