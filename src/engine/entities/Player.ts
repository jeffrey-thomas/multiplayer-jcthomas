import { Audio } from "../audio/Audio";
import { Mouse } from "../input/Mouse";
import { Scene } from "../Scene";
import { Vector } from "../Vector";
import { SpriteManager } from "../sprites";
import { Bullet } from "./Bullet";
import { Entity } from "./Entity";
import { EntityType } from "./EntityType";
import { Clock } from "../timing/Clock";

/** Represents the player */
export class Player extends Entity {

    /** X-coordinate the ship is moving towards */
    private _target = 320;
    /** speed along the x-direction */
    private _velocity = 0;
    /** maximum speed */
    private _maxVelocity = 1;

    /**
     * Constructor
     * @param scene the scene this entity will be part of 
     * @param position the starting location of this entity
     */
    constructor(scene: Scene, position?: Vector) {
        super(scene, EntityType.Player, SpriteManager.PLAYER, [32, 32], position)
        
        //Cycle between 2 frames of sprite
        this.frame = 0
        Clock.setTimer({
            action:()=>{ if(this.frame===0) this.frame = 1; else this.frame= 0 },
            duration:100,
        })

        //Subscribe to mouse events for controls
        Mouse.subscribeToClick(this)
        Mouse.subscribeToMove(this)
    }

    /**
     * onTick - logic that is run each cycle of the game
     * @param _timestamp number of milliseconds since the program started
     * @param elapsed number of milliseconds since the last cycle
     */   
    onTick(_timestamp: number, elapsed: number): void {
        
        //Determine how far we are from where we want to be
        const targetDeltaX = this._target - this.x
        if (Math.abs(targetDeltaX) < 1)
            return                      // leave if within 1 pixel, close enough

        const targetTime = 10  //how many milliseconds do we want it to take to get to target location

        //calculate acceleration needed to get to target location after target time
        const accel = 2 * (this._target - this.x - this._velocity * targetTime) / (targetTime * targetTime)
        const vel = this._velocity + accel * elapsed

        //clamp velocity to [-maxVelocity, maxVelocity]
        accel > 0 ? this._velocity = Math.min(this._maxVelocity, vel) : this._velocity = Math.max(0 - this._maxVelocity, vel)
        
        //determine how far we moved this cycle
        const deltaX = this._velocity * elapsed
        this.x += deltaX
    }

    /**
     * Handle mouse movement input - set target location to mouse x position
     * @param _event MouseEvent for the movement
     */
    onMouseMove(_event: React.MouseEvent<HTMLDivElement>) {
        this._target = Mouse.position[0]
    }

    /** Handle Mouse click event - Fire projectile*/
    onClick() {
        Audio.playSound(Audio.LASER)
        this.scene.addEntity(new Bullet(this.scene, [this.x, this.y]))
    }
}