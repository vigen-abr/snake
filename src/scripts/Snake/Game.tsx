import * as React from 'react';
import './Game.scss';
import Pixel from './components/Pixel/Pixel';
import TargetPixel from './components/TargetPixel/TargetPixel';
import {createPixel, createTarget} from './helpers/dataObjects';
import {pixelObject, targetObject} from "../../typings/Snake/helpers/dataObjects.d";

enum DIRECTION {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

const PIXEL_SIZE = 20;
const AREA_SIZE = PIXEL_SIZE * 20;

interface props {
}

interface state {
    pixels: pixelObject[],
    targets: targetObject[],
    direction: DIRECTION,
    gameOver: boolean
}

class Game extends React.Component<props> {
    public state: state;
    private moveIntervalId: number | undefined;
    private targetsIntervalId: number | undefined;
    private ongoingDirection: { correct: DIRECTION, reverse: DIRECTION } | undefined;

    constructor(props: props) {
        super(props);
        this.state = {
            pixels: [],
            targets: [],
            direction: DIRECTION.RIGHT,
            gameOver: false
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
        document.addEventListener("keydown", this.handleKeyDown);
    }

    render() {
        return [
            <div key="2" className={`game-wrapper ${this.state.gameOver ? 'game-wrapper--game-over' : ''}`}
                 style={{width: `${AREA_SIZE}px`, height: `${AREA_SIZE}px`}}>
                {this.state.targets.length}
                {this.state.pixels.map((px: pixelObject, idx: number) => <Pixel key={idx} size={PIXEL_SIZE} top={px.top}
                                                                                left={px.left}/>)}
                {this.state.targets.map((tg: targetObject, idx: number) => <TargetPixel key={idx} size={PIXEL_SIZE}
                                                                                        top={tg.top} left={tg.left}/>)}
            </div>
        ];
    }

    handleKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        const direction = this._mapEventToDirection(event);
        if (direction) {
            this.ongoingDirection = direction;
        }
    }

    _mapEventToDirection(event: KeyboardEvent): { correct: DIRECTION, reverse: DIRECTION } | false {
        switch (event.key) {
            case 'ArrowUp': {
                return {
                    correct: DIRECTION.UP,
                    reverse: DIRECTION.DOWN
                };
            }
            case 'ArrowRight': {
                return {
                    correct: DIRECTION.RIGHT,
                    reverse: DIRECTION.LEFT
                };
            }
            case 'ArrowDown': {
                return {
                    correct: DIRECTION.DOWN,
                    reverse: DIRECTION.UP
                };
            }
            case 'ArrowLeft': {
                return {
                    correct: DIRECTION.LEFT,
                    reverse: DIRECTION.RIGHT
                };
            }
            default: {
                return false
            }
        }
    }

    componentDidMount() {
        this._initFirstPixel();
        this.setIntervals();
    }

    _initFirstPixel() {
        const pixels = [...this.state.pixels];
        pixels.unshift(createPixel(PIXEL_SIZE));
        pixels.unshift(createPixel(PIXEL_SIZE));
        pixels.unshift(createPixel(PIXEL_SIZE));
        pixels.unshift(createPixel(PIXEL_SIZE));
        pixels.unshift(createPixel(PIXEL_SIZE));
        pixels.unshift(createPixel(PIXEL_SIZE));
        pixels.unshift(createPixel(PIXEL_SIZE));

        this.setState({pixels});
    }

    _updatePixelPositions(): void {
        const oldPixels = [...this.state.pixels];
        const res = oldPixels.reduce((acc: { previous?: pixelObject, pixels: pixelObject[] }, currentPixel) => {
            let current = {...currentPixel};
            if (acc.previous) {
                let previous = {...acc.previous};
                acc.previous = {...current};
                current = {...current, top: previous.top, left: previous.left};

            } else {
                acc.previous = {...current};
                this._movePixel(current);
            }
            acc.pixels.push(current);
            return acc;
        }, {pixels: []});

        const headPixel = res.pixels[0];
        if (this._hasBorderConflict(headPixel)) {
            return this._onGameOver()
        }
        if (this._hasSelfConflict(headPixel)) {
            return this._onGameOver();
        }
        if (this.state.targets.length) {

        }
        if (this.hasTargets) {
            const hitTargetIndex = this._hitTheTarget(headPixel);
            if (hitTargetIndex >= 0) {
                this.onTargetHit(hitTargetIndex);

            }
        }
        this.setState({pixels: res.pixels})


    }

    onTargetHit(targetIndex: number) {
        const targets = [...this.state.targets];
        //remove the hit target
        targets.splice(targetIndex, 1);
        this.setState({targets});
    }

    _updateDirection(): void {
        if (this.ongoingDirection && this.ongoingDirection.reverse !== this.state.direction) {
            this.setState({direction: this.ongoingDirection.correct});
            delete this.ongoingDirection;
        }
    }

    _onGameOver(): void {
        this.setState({gameOver: true});
        window.clearInterval(this.moveIntervalId);
        window.clearInterval(this.targetsIntervalId);
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    _hasBorderConflict(headPixel: pixelObject): boolean {
        return (headPixel.top + PIXEL_SIZE > AREA_SIZE ||
            headPixel.top < 0 ||
            headPixel.left < 0 ||
            headPixel.left + PIXEL_SIZE > AREA_SIZE);
    }

    _hasSelfConflict(hedPixel: pixelObject): boolean {
        return this.state.pixels.some((pixel: pixelObject) => {
            return pixel.top === hedPixel.top && pixel.left === hedPixel.left;
        });
    }

    _hitTheTarget(headPixel: pixelObject): number {
        return this.state.targets.findIndex((nextTarget: targetObject) => {
            return nextTarget.top === headPixel.top && nextTarget.left === headPixel.left
        });
    }

    _movePixel(pixel: pixelObject): pixelObject {
        switch (this.state.direction) {
            case DIRECTION.UP: {
                pixel.top -= PIXEL_SIZE;
                break;
            }
            case DIRECTION.RIGHT: {
                pixel.left += PIXEL_SIZE;
                break;
            }
            case DIRECTION.DOWN: {
                pixel.top += PIXEL_SIZE;
                break;
            }
            case DIRECTION.LEFT: {
                pixel.left -= PIXEL_SIZE;
                break;
            }
            default: {
                throw new Error(`Unknown direction ${this.state.direction}`);
            }
        }
        return pixel
    }

    setIntervals() {
        this.moveIntervalId = window.setInterval(() => {
            this._updateDirection();
            this._updatePixelPositions();
        }, 300);//todo add complexity
        this.targetsIntervalId = window.setInterval(() => {
            if (this.needsTarget) {
                this.setState({targets: [...this.state.targets, this._generateValidTarget()]})
            }
        }, 500)
    }

    _generateValidTarget(): targetObject {
        const target = createTarget(PIXEL_SIZE, AREA_SIZE);
        console.log(target);
        if (!this._isValidTarget(target)) {
            return this._generateValidTarget()
        }
        return target;
    }

    _isValidTarget(newTarget: targetObject): boolean {
        return !(this.state.pixels.some((pixel: pixelObject) => {
            return pixel.top === newTarget.top && pixel.left === newTarget.left
        }) || this.state.targets.some((target: targetObject) => {
            return target.top === newTarget.top && target.left === newTarget.left
        }))
    }

    get needsTarget(): boolean {
        return Math.random() >= 0.9; //todo add complexity
    }

    get hasTargets(): boolean {
        return !!this.state.targets.length;
    }
}

export default Game;
