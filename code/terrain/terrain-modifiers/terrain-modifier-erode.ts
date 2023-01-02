// ********************************************************************************************************************
import { clampZeroOne, round, sqrt } from "../../helpers/math.helper";
import { randomInteger } from "../../helpers/random.helper";
import { Modifier } from "../../modifiers/modifier";
import { Vector2 } from "../../types/vector2";
import { Vector2List } from "../../types/vector2-list";
import { TerrainCellGrid } from "../terrain-cell/terrain-cell-grid";
import { TerrainModifierWeights } from "./terrain-modifier-weights";
// ********************************************************************************************************************
export class TerrainModifierErode extends Modifier<TerrainCellGrid, TerrainCellGrid> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(public readonly erosionSpeed: number = 0.05, public readonly lifetime: number = 32, public readonly passes: number = 1, public readonly capacity: number = 0.05, public readonly depositSpeed: number = 0.3, public readonly inertia: number = 0.05, public readonly brush: number = 4) { super(); }

    // ****************************************************************************************************************
    // function:    modify
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modify(source: TerrainCellGrid): TerrainCellGrid {

        const weights = TerrainModifierWeights.generate(this.brush);

        const droplets = this.getDroplets(source);

        for (var pass = 0; pass < this.passes; pass++) {

            source = this.modifyPass(source, droplets, weights);
        }
        return source;
    }

    // ****************************************************************************************************************
    // function:    modifyPass
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    //              droplets - the droplets
    // ****************************************************************************************************************
    //              weights - the weights
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modifyPass(source: TerrainCellGrid, droplets: Vector2[], weights: number[][]): TerrainCellGrid {

        for (var i = 0; i < droplets.length; i++) {

            source = this.modifyPassAt(source, droplets[i], weights);
        }
        return source;
    }

    // ****************************************************************************************************************
    // function:    modifyPassAt
    // ****************************************************************************************************************
    //              droplet - the droplet
    // ****************************************************************************************************************
    //              weights - the weights
    // ****************************************************************************************************************
    // returns:     the target
    // ****************************************************************************************************************
    public modifyPassAt(source: TerrainCellGrid, droplet: Vector2, weights: number[][]): TerrainCellGrid {

        const flows = this.getFlows(source, droplet);

        if (flows.length > 1) {

            var sediment = 0;

            for (var i = 0; i < flows.length; i++) {

                const flow = flows[i];

                // ****************************************************************************************************
                // capacity breached
                // ****************************************************************************************************

                if (sediment >= this.capacity) {

                    const deposit = (sediment - this.capacity) * this.depositSpeed;

                    for (var wx = 0; wx < weights.length; wx++) {

                        for (var wy = 0; wy < weights[wx].length; wy++) {

                            const weight = weights[wx][wy];

                            const amount = weight * deposit;

                            const src = source.get(flow.x + wx, flow.y + wy);

                            src.height = clampZeroOne(src.height + amount);
                        }
                        sediment -= deposit;

                        continue;
                    }
                }

                // ****************************************************************************************************
                // final deposit
                // ****************************************************************************************************

                if (i === flows.length - 1) {

                    const deposit = sediment * this.depositSpeed;

                    for (var wx = 0; wx < weights.length; wx++) {

                        for (var wy = 0; wy < weights[wx].length; wy++) {

                            const weight = weights[wx][wy];

                            const amount = weight * deposit;

                            const src = source.get(flow.x + wx, flow.y + wy);

                            src.height = clampZeroOne(src.height + amount);
                        }
                    }
                    continue;
                }

                // ****************************************************************************************************
                // erosion
                // ****************************************************************************************************

                const erosion = this.capacity * this.erosionSpeed;

                for (var wx = 0; wx < weights.length; wx++) {

                    for (var wy = 0; wy < weights[wx].length; wy++) {

                        const weight = weights[wx][wy];

                        const amount = weight * erosion;

                        const src = source.get(flow.x + wx, flow.y + wy);

                        src.height = clampZeroOne(src.height - amount);
                    }
                }
                sediment += erosion;
            }
        }
        return source;
    }

    // ****************************************************************************************************************
    // function:    getDroplets
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    // returns:     the droplets
    // ****************************************************************************************************************
    private getDroplets(source: TerrainCellGrid): Vector2[] {

        // ************************************************************************************************************
        // find droplets
        // ************************************************************************************************************

        const droplets: Vector2[] = [];

        for (var x = 0; x < source.sizeX; x++) {

            for (var y = 0; y < source.sizeY; y++) {

                droplets.push(new Vector2(x, y));
            }
        }

        // ************************************************************************************************************
        // randomize droplets
        // ************************************************************************************************************

        for (var i = 0; i < droplets.length; i++) {

            const other = randomInteger(0, droplets.length - 1);

            [droplets[i], droplets[other]] = [droplets[other], droplets[i]]
        }
        return droplets;
    }

    // ****************************************************************************************************************
    // function:    getFlows
    // ****************************************************************************************************************
    // parameters:  source - the source
    // ****************************************************************************************************************
    //              droplet - the droplet
    // ****************************************************************************************************************
    // returns:     the flow
    // ****************************************************************************************************************
    private getFlows(source: TerrainCellGrid, droplet: Vector2): Vector2[] {

        // ************************************************************************************************************
        // setup variables
        // ************************************************************************************************************

        const flow = new Vector2List();

        var mx = 0, my = 0;

        // ************************************************************************************************************
        // traverse life time
        // ************************************************************************************************************

        for (var life = 0; life < this.lifetime; life++) {

            // ********************************************************************************************************
            // obtain movement
            // ********************************************************************************************************

            const oldGradient = source.getGradient(droplet.x, droplet.y);

            mx = ((mx * this.inertia) - (oldGradient.x * (1 - this.inertia)));

            my = ((my * this.inertia) - (oldGradient.y * (1 - this.inertia)));

            if (mx == 0 && my == 0) break;

            // ********************************************************************************************************
            // obtain distance normalized
            // ********************************************************************************************************

            var distance = sqrt((mx * mx) + (my * my));

            if (distance != 0) {

                mx /= distance;

                my /= distance;
            }

            // ********************************************************************************************************
            // move
            // ********************************************************************************************************

            droplet = new Vector2(droplet.x + mx, droplet.y + my);

            var x = round(droplet.x);

            var y = round(droplet.y);

            if (source.valid(x, y)) {

                flow.add(droplet);
            }
        }
        return flow.array;
    }
}
