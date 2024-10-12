import { Vector } from "./Vector";

/**
 * Represnts the motion of an enemy
 * path - a parameterized function for the position of the enemy for t=[0,1]
 * duration - the time it takes the enemy to travel the complete path in milliseconds
 */
export interface EnemyMotion {
    path: (t: number) => Vector,
    duration: number
}