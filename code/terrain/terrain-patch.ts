// ********************************************************************************************************************
import { BufferGeometry, Material, MeshStandardMaterial, Texture, Vector3 } from 'three';
import { GeometryBuilder } from '../geometry/geometry-builder';
import { GeometryData } from '../geometry/geometry-data';
import { clampZeroOne } from '../helpers/math.helper';
import { IEquality } from '../shared/equality.interface';
import { Bounds2 } from '../types/bounds2';
import { Canvas } from '../types/canvas';
import { Colour } from '../types/colour';
import { Vector2 } from '../types/vector2';
import { Vector2List } from '../types/vector2-list';
import { ITerrainHeights } from './terrain-heights.interface';
import { ITerrainVariance } from './terrain-variance.interface';
// ********************************************************************************************************************
enum Neighbour { N, E, S, W }
// ********************************************************************************************************************
export class TerrainPatch extends Bounds2 implements IEquality<TerrainPatch> {

    // ****************************************************************************************************************
    // center - the center
    // ****************************************************************************************************************
    private readonly center: Vector2;

    // ****************************************************************************************************************
    // children - the children
    // ****************************************************************************************************************
    private readonly children: TerrainPatch[] = [];

    // ****************************************************************************************************************
    // neighbours - the neighbours
    // ****************************************************************************************************************
    private readonly neighbours: (TerrainPatch | null)[] = [null, null, null, null];

    // ****************************************************************************************************************
    // variance - the variance
    // ****************************************************************************************************************
    private variance: ITerrainVariance | null = null;

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(private readonly pointNw: Vector2, private readonly pointNe: Vector2, private readonly pointSw: Vector2, private readonly pointSe: Vector2, private readonly heights: ITerrainHeights, private readonly root: TerrainPatch | null = null) {

        super(pointNw, pointSe);

        this.center = Vector2.mid(this.pointNw, this.pointSe);

        this.root = this.root ?? this;
    }

    // ****************************************************************************************************************
    // function:    createGeometry
    // ****************************************************************************************************************
    // parameters:  ceiling - the ceiling
    // ****************************************************************************************************************
    // returns:     the geometry
    // ****************************************************************************************************************
    public createGeometry(ceiling: number): BufferGeometry {

        const builder = new GeometryBuilder();

        if (this.root) {

            const rootDx = this.root.max.x - this.root.min.x;

            const rootDy = this.root.max.y - this.root.min.y;

            this.createGeometryInternal(builder, this.root.pointNw, rootDx, rootDy, ceiling);
        }
        const geometry = builder.generate();

        return geometry;
    }

    // ****************************************************************************************************************
    // function:    createGeometryInternal
    // ****************************************************************************************************************
    // parameters:  builder - the builder
    // ****************************************************************************************************************
    //              rootNw - the root north west
    // ****************************************************************************************************************
    //              rootDx - the root distance x
    // ****************************************************************************************************************
    //              rootDy - the root distance y
    // ****************************************************************************************************************
    //              ceiling - the ceiling
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    private createGeometryInternal(builder: GeometryBuilder, rootNw: Vector2, rootDx: number, rootDy: number, ceiling: number): void {

        if (this.children.length) {

            for (var i = 0; i < this.children.length; i++) {

                const child = this.children[i];

                child.createGeometryInternal(builder, rootNw, rootDx, rootDy, ceiling);
            }
        } else {

            // ********************************************************************************************************
            // setup points
            // ********************************************************************************************************

            const points = new Vector2List();

            points.add(this.center);

            // ********************************************************************************************************
            // process points north
            // ********************************************************************************************************

            const north = new Vector2List();

            north.addMulti([this.pointNw, this.pointNe]);

            this.neighbours[Neighbour.N]?.findPoints(north, this);

            north.sortByDistance(this.pointNw);

            points.addMulti(north.array);

            // ********************************************************************************************************
            // process points east
            // ********************************************************************************************************

            const east = new Vector2List();

            east.addMulti([this.pointNe, this.pointSe]);

            this.neighbours[Neighbour.E]?.findPoints(east, this);

            east.sortByDistance(this.pointNe);

            points.addMulti(east.array);

            // ********************************************************************************************************
            // process points south
            // ********************************************************************************************************

            const south = new Vector2List();

            south.addMulti([this.pointSe, this.pointSw]);

            this.neighbours[Neighbour.S]?.findPoints(south, this);

            south.sortByDistance(this.pointSe);

            points.addMulti(south.array);

            // ********************************************************************************************************
            // process points west
            // ********************************************************************************************************

            const west = new Vector2List();

            west.addMulti([this.pointSw, this.pointNw]);

            this.neighbours[Neighbour.W]?.findPoints(west, this);

            west.sortByDistance(this.pointSw);

            points.addMulti(west.array);

            // ********************************************************************************************************
            // process single patch or fan
            // ********************************************************************************************************

            if (points.array.length === 5) {

                const geometries = this.createGeometryData([this.pointNw, this.pointNe, this.pointSw, this.pointSe], rootNw, rootDx, rootDy, ceiling);

                var indices = builder.addGeometries(geometries);

                builder.addIndices([indices[1], indices[0], indices[2], indices[3], indices[1], indices[2]]);
            } else {

                var last = false;

                const geometries = this.createGeometryData(points.array, rootNw, rootDx, rootDy, ceiling);

                for (var i = 1; i < geometries.length; i++, last = (i === geometries.length - 1)) {

                    const geometry1 = geometries[i];

                    const geometry2 = geometries[last ? 1 : i + 1];

                    const indices = builder.addGeometries([geometry1, geometries[0], geometry2]);

                    builder.addIndices(indices);
                }
            }
        }
    }

    // ****************************************************************************************************************
    // function:    createGeometryData
    // ****************************************************************************************************************
    // parameters:  points - the points
    // ****************************************************************************************************************
    //              rootNw - the root north west
    // ****************************************************************************************************************
    //              rootDx - the root distance x
    // ****************************************************************************************************************
    //              rootDy - the root distance y
    // ****************************************************************************************************************
    //              ceiling - the ceiling
    // ****************************************************************************************************************
    // returns:     the geometry data
    // ****************************************************************************************************************
    private createGeometryData(points: Vector2[], rootNw: Vector2, rootDx: number, rootDy: number, ceiling: number): GeometryData[] {

        const geometries: GeometryData[] = [];

        if (this.root) {

            for (var i = 0; i < points.length; i++) {

                const point = points[i];

                // ****************************************************************************************************
                // obtain uvs
                // ****************************************************************************************************

                const tu = (point.x - rootNw.x) / rootDx;

                const tv = (point.y - rootNw.y) / rootDy;

                // ****************************************************************************************************
                // obtain geometry
                // ****************************************************************************************************

                const height = this.heights.getHeight(point.x, point.y);

                const position = new Vector3(point.x, height * ceiling, point.y);

                const colour = this.heights.getColour(point.x, point.y);

                const normal = new Vector3(0, 1, 0);

                const uv = new Vector2(tu, 1 - tv);

                const geometry = new GeometryData(position, uv, normal, colour);

                geometries.push(geometry);
            }
        }
        return geometries;
    }

    // ****************************************************************************************************************
    // function:    createMaterial
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     the material
    // ****************************************************************************************************************
    public createMaterial(): Material {

        const normalMap = this.createNormalMap();

        const result = new MeshStandardMaterial({ roughness: 1.0, normalMap: normalMap, vertexColors: true, wireframe: false });

        return result;
    }

    // ****************************************************************************************************************
    // function:    createNormalMap
    // ****************************************************************************************************************
    // parameters:  size - the size
    // ****************************************************************************************************************
    // returns:     the normal map
    // ****************************************************************************************************************
    public createNormalMap(size: number = 32): Texture {

        // ************************************************************************************************************
        // setup variables
        // ************************************************************************************************************

        const canvas = new Canvas(size, size);

        const dx = this.pointNe.x - this.pointNw.x;

        const dy = this.pointSw.y - this.pointNw.y;

        const ox = dx / size; const oy = dy / size;

        // ************************************************************************************************************
        // traverse pixels
        // ************************************************************************************************************

        for (var x = 0; x < size; x++) {

            for (var y = 0; y < size; y++) {

                // ****************************************************************************************************
                // obtain normal
                // ****************************************************************************************************

                const px = this.pointNw.x + (x * ox);

                const py = this.pointNw.y + (y * oy);

                const normal = this.heights.getNormal(px, py);

                // ****************************************************************************************************
                // obtain colour
                // ****************************************************************************************************

                const cx = clampZeroOne((normal.x * 0.5) + 0.5);

                const cy = clampZeroOne((normal.y * 0.5) + 0.5);

                const cz = clampZeroOne((normal.z * 0.5) + 0.5);

                const colour = new Colour(cx, cz, cy);

                canvas.setPixel(x, y, colour);
            }
        }
        return canvas.getTexture();
    }

    // ****************************************************************************************************************
    // function:    findPoints
    // ****************************************************************************************************************
    // parameters:  points - the points
    // ****************************************************************************************************************
    //              bounds - the bounds
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    private findPoints(points: Vector2List, bounds: Bounds2): void {

        if (this.intersects(bounds)) {

            if (this.children.length) {

                for (var i = 0; i < this.children.length; i++) {

                    const child = this.children[i];

                    child.findPoints(points, bounds);
                }
            } else {

                if (bounds.insideOrOnEdge(this.pointNw)) points.add(this.pointNw);

                if (bounds.insideOrOnEdge(this.pointNe)) points.add(this.pointNe);

                if (bounds.insideOrOnEdge(this.pointSw)) points.add(this.pointSw);

                if (bounds.insideOrOnEdge(this.pointSe)) points.add(this.pointSe);
            }
        }
    }

    // ****************************************************************************************************************
    // function:    setNeighbour
    // ****************************************************************************************************************
    // parameters:  which - which neighbour
    // ****************************************************************************************************************
    //              neighbour - the neighbour
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    private setNeighbour(which: Neighbour, neighbour: TerrainPatch | null): void {

        if (neighbour) {

            if (which === Neighbour.N && !neighbour.neighbours[Neighbour.S]) neighbour.neighbours[Neighbour.S] = this;

            if (which === Neighbour.E && !neighbour.neighbours[Neighbour.W]) neighbour.neighbours[Neighbour.W] = this;

            if (which === Neighbour.S && !neighbour.neighbours[Neighbour.N]) neighbour.neighbours[Neighbour.N] = this;

            if (which === Neighbour.W && !neighbour.neighbours[Neighbour.E]) neighbour.neighbours[Neighbour.E] = this;
        }
        this.neighbours[which] = neighbour;
    }

    // ****************************************************************************************************************
    // function:    setNeighbours
    // ****************************************************************************************************************
    // parameters:  north - the north
    // ****************************************************************************************************************
    //              east - the east
    // ****************************************************************************************************************
    //              south - the south
    // ****************************************************************************************************************
    //              west - the west
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public setNeighbours(north: TerrainPatch | null, east: TerrainPatch | null, south: TerrainPatch | null, west: TerrainPatch | null): void {

        this.setNeighbour(Neighbour.N, north);

        this.setNeighbour(Neighbour.E, east);

        this.setNeighbour(Neighbour.S, south);

        this.setNeighbour(Neighbour.W, west);
    }

    // ****************************************************************************************************************
    // function:    split
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    private split(): TerrainPatch[] {

        if (this.children.length === 0) {

            // ********************************************************************************************************
            // obtain neighbours
            // ********************************************************************************************************

            const neighbourN = this.neighbours[Neighbour.N];

            const neighbourE = this.neighbours[Neighbour.E];

            const neighbourS = this.neighbours[Neighbour.S];

            const neighbourW = this.neighbours[Neighbour.W];

            // ********************************************************************************************************
            // obtain points
            // ********************************************************************************************************

            const pointN = Vector2.mid(this.pointNw, this.pointNe);

            const pointE = Vector2.mid(this.pointNe, this.pointSe);

            const pointS = Vector2.mid(this.pointSe, this.pointSw);

            const pointW = Vector2.mid(this.pointSw, this.pointNw);

            // ********************************************************************************************************
            // obtain patches
            // ********************************************************************************************************

            const patchNw = new TerrainPatch(this.pointNw, pointN, pointW, this.center, this.heights, this.root);

            const patchNe = new TerrainPatch(pointN, this.pointNe, this.center, pointE, this.heights, this.root);

            const patchSw = new TerrainPatch(pointW, this.center, this.pointSw, pointS, this.heights, this.root);

            const patchSe = new TerrainPatch(this.center, pointE, pointS, this.pointSe, this.heights, this.root);

            // ********************************************************************************************************
            // obtain neighbours
            // ********************************************************************************************************

            patchNw.setNeighbours(neighbourN, patchNe, patchSw, neighbourW);

            patchNe.setNeighbours(neighbourN, neighbourE, patchSe, patchNw);

            patchSw.setNeighbours(patchNw, patchSe, neighbourS, neighbourW);

            patchSe.setNeighbours(patchNe, neighbourE, neighbourS, patchSw);

            // ********************************************************************************************************
            // process children
            // ********************************************************************************************************

            this.children.push(...[patchNw, patchNe, patchSe, patchSw]);
        }
        return this.children;
    }

    // ****************************************************************************************************************
    // function:    tesselate
    // ****************************************************************************************************************
    // parameters:  multiplier - the multiplier
    // ****************************************************************************************************************
    //              limiter - the limiter
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public tesselate(multiplier: number = 0.1, limiter: number = 0.1): void {

        this.variance = this.heights.getVariance(this.pointNw.x, this.pointNw.y, this.pointSe.x, this.pointSe.y, limiter);

        if (this.variance) this.tesselateInternal(this.variance, this.variance.variance * multiplier);
    }

    // ****************************************************************************************************************
    // function:    tesselateInternal
    // ****************************************************************************************************************
    // parameters:  variance - the variance
    // ****************************************************************************************************************
    //              limiter - the limiter
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    private tesselateInternal(variance: ITerrainVariance, limiter: number): void {

        if (variance.variance >= limiter) {

            const children = this.split();

            if (variance.varianceNw) children[0].tesselateInternal(variance.varianceNw, limiter);

            if (variance.varianceNe) children[1].tesselateInternal(variance.varianceNe, limiter);

            if (variance.varianceSe) children[2].tesselateInternal(variance.varianceSe, limiter);

            if (variance.varianceSw) children[3].tesselateInternal(variance.varianceSw, limiter);
        }
    }
}
