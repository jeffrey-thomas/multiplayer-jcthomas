import { Scene } from "../Scene";
import { Vector } from "../Vector";
import { SpriteManager } from "../sprites";
import { Entity } from "./Entity";
import { EntityType } from "./EntityType";

/**
 * Represents an explosion from a destroyed entity
 */
export class Explosion extends Entity {

    /** timestamp of when the explosion started */
    private _start:number

    /**
     * Constructor
     * @param scene the scene this explosion will be in 
     * @param start the timestamp for the start of the explosion
     * @param position the location of the explosion
     */
    constructor(scene:Scene, start:number, position: Vector = [0, 0]) {
        super(scene,EntityType.Explosion,SpriteManager.EXPLOSION, [64,64], position)
        this.frame = 0
        this._start = start
    }

    /**
     * onTick - Use the diffrence between start and timestamp to determine frame of animation
     * @param timestamp number of milliseconds since program started
     * @param _elapsed number of milliseconds since last cycle
     */
    onTick(timestamp: number, _elapsed: number): void {
       this.frame = Math.floor((timestamp-this._start)/20)
    }

}