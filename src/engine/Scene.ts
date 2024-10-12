import { Audio } from "./audio/Audio";
import { Entity, EntityType, Explosion } from "./entities";
import { GameState } from "./GameState";
import { GameStateManager } from "./GameStateManager";
import { Rectangle } from "./Rectangle";
import { Clock } from "./timing";
import { Vector } from "./Vector";

/** Represents a group of entities that can interact */
export class Scene {

    /** All of the entities in the scene grouped by type */
    private _entities: Map<EntityType, Entity[]>
    /** The boundaries of the scene */
    private _bounds: Rectangle

    /**
     * Constructor
     * @param bounds rectangle the indicates the boundaries of the scene 
     */
    constructor(bounds: Rectangle) {
        this._bounds = bounds
        this._entities = new Map<EntityType, Entity[]>()
    }

    //Getters
    /** All Player type entities in the scene */
    get players() { return this.getEntities(EntityType.Player) }
    /** All Enemy type entities in the scene */
    get enemies() { return this.getEntities(EntityType.Enemy) }
    /** All Bullet type entities in the scene */
    get bullets() { return this.getEntities(EntityType.Bullet) }
    /** All Bomb type entities in the scene */
    get bombs() { return this.getEntities(EntityType.Bomb) }
    /** All Explosion type entities in the scene */
    get explosions() { return this.getEntities(EntityType.Explosion) }
    /** All entities in the scene */
    get entities() { return this.getEntities() }

    /**
     * Add an entity to the scene
     * @param entity the entity to add
     */
    addEntity(entity: Entity) {
        if (!this._entities.get(entity.type))
            this._entities.set(entity.type, [])
        this._entities.get(entity.type)!.push(entity)
    }

    /**
     * Remove an entity from the scene
     * @param entity the entity to remove
     */
    removeEntity(entity: Entity) {
        if (!this._entities.get(entity.type))
            return

        this._entities.set(entity.type, this._entities.get(entity.type)!.filter((e) => e !== entity))
    }

    /**
     * Get all of the entities, optionally filtered by type
     * @param type optional, indicates the type of entity to retrieve
     * @returns an array of entities
     */
    getEntities(type?: EntityType): Entity[] {
        if (type)
            return this._entities.get(type) || []
        else {
            return [...this.players, ... this.enemies, ...this.bullets, ... this.bombs, ...this.explosions]
        }
    }

    /**
     * Logic to run every cycle of the game engine
     * @param timestamp the number of milliseconds since the program started
     * @param elapsedTime the number of milliseconds since the last cycle
     */
    onTick(timestamp: number, elapsedTime: number) {
        this.entities.forEach((entity) => { entity.onTick(timestamp, elapsedTime) })

        //Check collisions if not game over
        if (GameStateManager.state === GameState.Active)
            this.checkCollisions(timestamp)

        //check if oldest bullet has reached top of screen
        const bullets = this.getEntities(EntityType.Bullet)
        if (bullets.length > 0 && bullets[0].y < -16) {
            this.removeEntity(bullets[0])
        }

        //check if oldest bomb has reached bottom of screen
        const bombs = this.getEntities(EntityType.Bomb)
        if (bombs.length > 0 && bombs[0].y > this._bounds.bottom + 16) {
            this.removeEntity(bombs[0])
        }
    }

    /**
     * Creates an explosion entity and sets a timer to remove it after the animation is done
     * @param timestamp the current time, used to determine frame in the explosion
     * @param position the location for the new explosion
     */
    createExplosion(timestamp: number, position: Vector) {
        const explosion = new Explosion( this, timestamp, position )
        this.addEntity(explosion)
        Audio.playSound(Audio.EXPLOSION)
        Clock.setTimer({
            action: () => {
                this.removeEntity(explosion)
            },
            duration: 240,
            count: 1
        })
    }

    /**
     * Check for collision between bullets and enemies and bombs and players
     */
    checkCollisions(timestamp: number) {
        //Check if bullet colliding with enemy
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (bullet.boundingBox.intersects(enemy.boundingBox)) {
                    this.createExplosion(timestamp, enemy.position)
                    this.bullets.splice(bulletIndex, 1)
                    this.enemies.splice(enemyIndex, 1)
                    //check if last enemy
                    if(this.enemies.length===0)
                        GameStateManager.startNextWave()
                }
            })
        })

        //Check if bomb colliding with player
        this.bombs.forEach((bomb, bombIndex) => {
            if (this.players.length > 0) {
                const player = this.players[0]
                if (bomb.boundingBox.intersects(player.boundingBox)) {
                    Audio.playSound(Audio.DEATH)
                    this.createExplosion(timestamp, player.position)
                    this.bombs.splice(bombIndex, 1)
                    this.removeEntity(player)
                    Clock.setTimer({
                        action: GameStateManager.endGame,
                        duration: 500,
                        count: 1
                    })
                   
                }
            }
        })

    }
}
