import { EnemyMotion } from "./EnemyMotion"

/**
 * Represents a wave of enemies
 * motion - the EnemyMotion that describes the motion of enemies in this wave
 * count - the number of enemies in this wave
 */
export type EnemyWave = {
    motion:EnemyMotion,
    count:number,
}