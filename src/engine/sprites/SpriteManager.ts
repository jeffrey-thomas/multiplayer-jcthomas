import { Vector } from "../Vector";
import { Sprite } from "./Sprite";
import { SpriteId } from "./SpriteId";

/** Singleton that loads and stores sprite data */
export class SpriteManager{

    /** All of the sprites that have been loaded */
    private _sprites:Map<SpriteId,Sprite>

    /** Base location of images for sprites */
    private _basePath:string = '../../assets/'

    /** Placeholder for unknown sprites */
    private _unknown:Sprite = new Sprite(`${this._basePath}unknown.webp`,16,16)

    //SpriteIds
    static readonly PLAYER = Symbol(`Sprite:player.webp`)
    static readonly BULLET = Symbol(`Sprite:bullet.webp`)
    static readonly BOMB = Symbol(`Sprite:bomb.webp`)
    static readonly ENEMY = Symbol(`Sprite:enemy.webp`)
    static readonly EXPLOSION = Symbol(`Sprite:explosion.webp`)
    static readonly BACKGROUND = Symbol(`Sprite:background.webp`)

    /** Singleton instance */
    private static _instance:SpriteManager

    /** Private Constructor enforces singleton */
    private constructor(){ 
        this._sprites = new Map<SpriteId, Sprite>() 
    }

    /**
     * Get the singleton instance of SpriteManager creating it if necessary
     */
    private static get instance(){
        if(!SpriteManager._instance){
            SpriteManager._instance = new SpriteManager()
            SpriteManager.createSprite('player.webp', 64, 32, [32, 32], SpriteManager.PLAYER)
            SpriteManager.createSprite('enemy.webp', 128, 32, [32, 32],SpriteManager.ENEMY)
            SpriteManager.createSprite('bullet.webp', 8, 16,[8,16],SpriteManager.BULLET)
            SpriteManager.createSprite('explosion.webp', 256, 192, [64, 64],SpriteManager.EXPLOSION)
            SpriteManager.createSprite('bomb.webp', 20, 14, [20,14],SpriteManager.BOMB)
            SpriteManager.createSprite('background.webp', 640, 480,[640,480],SpriteManager.BACKGROUND)
        }

        return SpriteManager._instance
    }

    /**
     * Create a sprite from an image and return its id
     * @param src path to the image
     * @param width width of the sprite
     * @param height height of the sprite
     * @param frameSize if this is an animated sprite, this is the size of one frame
     * @param id optional, the id to assign the sprite if omitted one is generated
     * @returns id of the sprite
     */
    static createSprite(src:string, width:number, height:number, frameSize?:Vector, id:SpriteId = Symbol(`Sprite:${src}`)){
        SpriteManager.instance._sprites.set(id,new Sprite(`${SpriteManager.instance._basePath}${src}`,width,height,frameSize))
        return id;
    }

    /**
     * Delete a Sprite
     * @param id id of Sprite to delete
     * @returns true if Sprite existed and has been deleted, false if Sprite does not exist (e.g. already deleted) 
     */
    static deleteSprite(id:SpriteId){
        return SpriteManager.instance._sprites.delete(id)
    }

    /**
     * Get the Sprite that has the specified SpriteId
     * @param id SpriteId of the Sprite to retrieve
     * @returns the Sprite associated with the SpriteId, placeholder if no Sprite has that id
     */
    static get(id:SpriteId){
        return SpriteManager.instance._sprites.get(id) || SpriteManager.instance._unknown
    }

    /**
     * Return whether there is a Sprite with the specified SpriteId
     * @param id SpriteId to check
     * @returns true if there is a Sprite with that SpriteId, otherwise false
     */
    static has(id:SpriteId){
        return SpriteManager.instance._sprites.has(id)
    }
}