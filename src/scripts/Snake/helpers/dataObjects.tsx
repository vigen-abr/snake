import {pixelObject, targetObject} from "../../../typings/Snake/helpers/dataObjects.d";

let initialLeft = 0;
let initialPixelIndex = 0;
let initialTargetIndex = 0;

export function createPixel(size: number): pixelObject {
    return {
        top: 0,
        left: initialLeft += size,
        _index: ++initialPixelIndex
    }
}

export function createTarget(size: number, areaSize: number): targetObject {
    return {
        top: getRandomInt(0, areaSize/size - 1) * size,
        left: getRandomInt(0, areaSize/size - 1) * size,
        _index: ++initialTargetIndex
    }
}


function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
