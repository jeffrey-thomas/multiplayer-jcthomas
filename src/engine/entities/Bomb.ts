import { Scene } from "../Scene";
import { Vector } from "../Vector";
import { SpriteManager } from "../sprites";
import { Entity } from "./Entity";
import { EntityType } from "./EntityType";

/**
 * Represents an enemy's downwards projectile
 */
export class Bomb extends Entity {

    private velocity = 360;

    /**
     * Constructor
     * @param scene the scene this entity will be part of
     * @param position the location where this entity will be created
     */
    constructor(scene:Scene, position?: Vector) {
        super(scene,EntityType.Bomb,SpriteManager.BOMB, [20,14], position)
    }

    /**
     * onTick - logic that is run each cycle of the game
     * @param _timestamp number of milliseconds since the program started
     * @param elapsed number of milliseconds since the last cycle
     */
    onTick(_timestamp: number, elapsed: number): void {
        this.y += this.velocity * elapsed / 1000;
    }

}