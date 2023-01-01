// ********************************************************************************************************************
import { ITerrainVariance } from "./terrain-variance.interface";
// ********************************************************************************************************************
export interface ITerrainHeights {
    getHeight(x: number, y: number): number;
    getVariance(x1: number, y1: number, x2: number, y2: number): ITerrainVariance | null;
}
