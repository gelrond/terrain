export interface ITerrainVariance {
    varianceNw?: ITerrainVariance | null,
    varianceNe?: ITerrainVariance | null,
    varianceSw?: ITerrainVariance | null,
    varianceSe?: ITerrainVariance | null,
    variance: number
}
