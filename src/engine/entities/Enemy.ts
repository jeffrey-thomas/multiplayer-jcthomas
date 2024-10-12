import { EnemyMotion } from "../EnemyMotion";
import { Scene } from "../Scene";
import { SpriteManager } from "../sprites";
import { Bomb } from "./Bomb";
import { Entity } from "./Entity";
import { EntityType } from "./EntityType";
import { Audio } from '../audio/Audio'

/**
 * Represents an enemy 'martian'
 */
export class Enemy extends Entity {

    //Information about how this enemy will move (different for every wave/level)
    private _motion: EnemyMotion
    private _motionPoint: number
    private _yOffset:number = -500

    //Delay between firing projectile and charging animation
    private _charge = 0
    private _chargeDelay: number = 0

    /**
     * Constructor
     * @param scene the scene this entity will be part of
     * @param motion the EnemyMotion object that will describe this entities motion
     * @param motionPoint the point along the path this enemy will start at [0,1]
     */
    constructor(scene: Scene, motion: EnemyMotion, motionPoint: number) {
        const position = motion.path(motionPoint)
        super(scene, EntityType.Enemy, SpriteManager.ENEMY, [32, 32], position)
        this.frame = 0
        this.position[1] += this._yOffset
        this._motion = motion
        this._motionPoint = motionPoint

        this.setChargeDelay()
    }

    /** Create a random delay between firing of 3 to 8 seconds */
    private setChargeDelay() {
        this._chargeDelay = 3000 + Math.floor(Math.random() * 5000)
    }

    /**
     * onTick - logic that is run each cycle of the game
     * @param _timestamp number of milliseconds since the program started
     * @param elapsed number of milliseconds since the last cycle
     */
    onTick(_timestamp: number, elapsed: number): void {

        //Advance motionPoint based on how much time has passed since last cycle, restart when passing 1
        this._motionPoint = (this._motionPoint + elapsed / this._motion.duration) % 1

        //Handle the initial descent from the top of the screen
        if(this._yOffset<0)  this._yOffset += elapsed/8
        if(this._yOffset >0) this._yOffset = 0

        //Calculate the x,y coordinates from the new motionPoint
        this.position = this._motion.path(this._motionPoint)
        this.position[1]+=this._yOffset

        //Check if it is time to fire another projectile
        if (this._chargeDelay <= 0) {
            this._charge += elapsed / 250   //give a few frames of charging animation as a warning
            //If finished charging, fire projectile
            if (this._charge > 3) {
                this._charge = 0
                this.setChargeDelay()
                Audio.playSound(Audio.BOMB)
                this.scene.addEntity(new Bomb(this.scene,[this.x + 6, this.y + 9]))
            }
        }
        else {
            this._chargeDelay -= elapsed
        }
        
        this.frame = Math.floor(this._charge)
    }

}