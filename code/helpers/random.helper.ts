// ********************************************************************************************************************
import * as THREE from 'three';
// ********************************************************************************************************************

// ********************************************************************************************************************
// function:    random
// ********************************************************************************************************************
// parameters:  min - the min
// ********************************************************************************************************************
//              max - the max
// ********************************************************************************************************************
// returns:     the result
// ********************************************************************************************************************
export function random(min: number, max: number): number {

    const result = THREE.MathUtils.randFloat(min, max);

    return result;
}

// ********************************************************************************************************************
// function:    randomChance
// ********************************************************************************************************************
// parameters:  chance - the chance
// ********************************************************************************************************************
// returns:     the result
// ********************************************************************************************************************
export function randomChance(chance: number): boolean {

    const result = randomZeroOne() > chance;

    return result;
}

// ********************************************************************************************************************
// function:    randomInteger
// ********************************************************************************************************************
// parameters:  min - the min
// ********************************************************************************************************************
//              max - the max
// ********************************************************************************************************************
// returns:     the result
// ********************************************************************************************************************
export function randomInteger(min: number, max: number): number {

    const result = THREE.MathUtils.randInt(min, max);

    return result;
}

// ********************************************************************************************************************
// function:    randomZeroOne
// ********************************************************************************************************************
// parameters:  n/a
// ********************************************************************************************************************
// returns:     the result
// ********************************************************************************************************************
export function randomZeroOne(): number {

    const result = random(0, 1);

    return result;
}
