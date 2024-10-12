import { Enemy, Player } from "./entities"
import { Rectangle } from "./Rectangle"
import { Clock, TimerId } from "./timing"
import { Mouse } from "./input/Mouse"
import { Scene } from "./Scene"
import { EnemyWave } from "./EnemyWave"

/** Handles manipulating the scene */
export class SceneManager {

    /** The current scene */
    private _scene: Scene
    /** The current enemy wave */
    private _wave: number = 0

    /** Information needed to create each wave */
    private _waves:EnemyWave[] =[
        {
            motion:{
                path: (t) => { 
                    return [this._bounds.centerX + 300 * Math.cos(2 * Math.PI * t), this._bounds.centerY] 
                },
                duration:5000
            },
            count:1
        },
        {
            motion:{
                path: (t) => { 
                    return [this._bounds.centerX + 120 * Math.cos(2 * Math.PI * t), this._bounds.centerY + 120 * Math.sin(2 * Math.PI * t)] 
                },
                duration:5000
            },
            count:10
        },
        {
            motion:{
                path:(t)=>{
                    if(t<0.25)
                        return [ 32+2304*t,32]
                    else if(t<0.5)
                        return [608, 32+1440*(t-0.25)]
                    else if(t<0.75)
                        return [608-2304*(t-0.5),392]
                    else
                        return [32, 392-1449*(t-0.75)]
                },
                duration: 8000
            },
            count:40
        }
    ]

    /** Id of the timer that tracks each cycle */
    private _ticker: TimerId
    /** The boundaries of the scene */
    private _bounds: Rectangle

    /**
     * Constructor
     * @param bounds the boundaries to give the scene 
     */
    constructor(bounds: Rectangle) {

        //Create scene and add Player
        this._bounds = bounds
        this._scene = new Scene(this._bounds)
        this._scene.addEntity(new Player(this._scene, [bounds.centerX, bounds.bottom - 32]))

        //Update Entities every tick
        this._ticker = Clock.setTimer({ action: this.UpdateEntities.bind(this), }, false)

        //Set the mouse to have the same bounds as the scene
        Mouse.bounds = bounds
    }

    /** The timer for game logic */
    get timer() { return this._ticker }
    /** All of the entities in the scene */
    get entities() { return this._scene.getEntities() }
    /** The current enemy wave */
    get wave() { return this._wave }

    /**
     * Have the scene run the game logic for this time step
     * @param timestamp the number of milliseconds since the program started
     * @param elapsedTime the number of milliseconds since the last cycle
     */
    private UpdateEntities(timestamp: number, elapsedTime: number) {
        this._scene.onTick(timestamp, elapsedTime)

    }

    /**
     * Add the enemy entities for a given wave to the scene
     * @param waveIndex the wave number to add to the scene
     * @returns whether the entities were added, false if the index is invalid
     */
    addWave(waveIndex:number){
        if(waveIndex<this._waves.length){
            const wave = this._waves[waveIndex]
            for(let i=0; i < wave.count; i++){
                this._scene.addEntity(
                    new Enemy(this._scene,wave.motion,i/wave.count)
                )
            }
            return true
        }
        return false   
    }
}