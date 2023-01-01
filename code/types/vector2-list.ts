// ********************************************************************************************************************
import { List } from './list';
import { Vector2 } from './vector2';
// ********************************************************************************************************************
export class Vector2List extends List<Vector2> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(vectors: Vector2[] = []) { super(vectors); }

    // ****************************************************************************************************************
    // function:    sortByDistance
    // ****************************************************************************************************************
    // parameters:  origin - the origin
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public sortByDistance(origin: Vector2): void {

        this.array.sort((vector1, vector2) => {

            const distance1 = vector1.distanceTo(origin);

            const distance2 = vector2.distanceTo(origin);

            return distance1 - distance2;
        })
    }
}
