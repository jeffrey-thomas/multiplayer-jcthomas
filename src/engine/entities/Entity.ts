import { Rectangle } from "../Rectangle"
import { Scene } from "../Scene"
import { Vector } from "../Vector"
import { SpriteId } from "../sprites"
import { EntityType } from "./EntityType"

/**
 * Represents a dynamic entity in the game
 */
export abstract class Entity {

    /** store EntityType so logic knows what to do with this entity */
    private _type:EntityType             
    
    /** the scene this entity is part of */
    private _scene:Scene                 
    
    /** position on the screen */
    private _position: Vector            
    
    /** width and height of rectangle used for collisions */
    private _boundingBoxSize: Vector     
    
    /** which sprite will represent this entity on screen */
    private _sprite: SpriteId            
    
    /** For animated sprites;the current frame of the animation to display */
    private _frame?:number               

    /**
     * Constructor
     * @param scene the scene this entity will be part of
     * @param type the EntityType of this entity
     * @param sprite the sprite this entity will use
     * @param boundingBoxSize the width and height of the bounding box for this entity
     * @param position the starting location of this entity
     */
    constructor(scene:Scene, type:EntityType, sprite: SpriteId, boundingBoxSize:Vector, position: Vector = [0, 0]) {
        this._scene = scene
        this._type = type
        this._sprite = sprite
        this._position = position
        this._boundingBoxSize = boundingBoxSize
    }

    //Getters

    /** The scene this entity is part of */
    get scene(){ return this._scene }
    
    /** The type of this entity */
    get type(){ return this._type }
    
    /** The x-coordinate of this entity */
    get x() { return this._position[0] }
    
    /** The y-coordinate of this entity */
    get y() { return this._position[1] }
    
    /** The position of this entity; [x,y] */
    get position() { return this._position }
    
    /** The id for the sprite for this entity */
    get sprite() { return this._sprite }
    
    /** The current frame of any animation to display */
    get frame():number|undefined{ return this._frame }
    
    /** The rectangle to use for collision checks */
    get boundingBox(){ 
        return new Rectangle(
            this._position[0]-this._boundingBoxSize[0]/2,
            this._position[1]-this._boundingBoxSize[1]/2,
            this._boundingBoxSize[0],
            this._boundingBoxSize[1]
        )
    }

    //Setters
    set x(value: number) { this._position[0] = Math.floor(value) }
    set y(value: number) { this._position[1] = Math.floor(value) }
    set position(value: [number, number]) { this._position = [Math.floor(value[0]),Math.floor(value[1])] }
    set frame(value:number){ this._frame = value }

    /** All Entities must implement an onTick method - logic that is run each cycle of the game
     * @param _timestamp number of milliseconds since the program started
     * @param elapsed number of milliseconds since the last cycle
     */
    abstract onTick(timestamp: number, elapsed: number): void;

}