import { MouseClickObserver, MouseMoveObserver } from './MouseObserver'
import { Rectangle } from "../Rectangle";
import { Vector } from "../Vector";
import { GameStateManager } from '../GameStateManager';
import { GameState } from '../GameState';

/**
 * Receives mouse input from HTML DOM element and passes it on to subscribers
 */
export class Mouse {

    /** set of observers for mouse clicks */
    private _clickObservers: Set<MouseClickObserver>
    /** set of observers for mouse movement */
    private _moveObservers:Set<MouseMoveObserver>
    /** position of the mouse */
    private _position: Vector = [0, 0]
    /** mouse sensitivty factor */
    private _sensitivity: number = 1
    /** rectangle to clamp the mouse's position within */
    private _bounds?: Rectangle

    /** Singleton instance */
    private static _instance: Mouse

    /** private constructor enforces singleton */
    private constructor() { 
        this._clickObservers = new Set<MouseClickObserver>()
        this._moveObservers = new Set<MouseMoveObserver>()
    }

    /** Get singleton instance, create it if needed */
    private static get instance() {
        if (!Mouse._instance)
            Mouse._instance = new Mouse()

        return Mouse._instance
    }

    //Getters
    static get position() { return Mouse.instance._position }
    static get sensitivity() { return Mouse.instance._sensitivity }
    static get bounds() { return Mouse.instance._bounds }

    //Setters
    static set sensitivity(sensitivity: number) { Mouse.instance._sensitivity = sensitivity; }
    static set bounds(bounds: Rectangle | undefined) { Mouse.instance._bounds = bounds }

    /**
     * Subscribe to mouse click event
     * @param observer object with an onClick method
     */
    static subscribeToClick(observer:MouseClickObserver){
        Mouse.instance._clickObservers.add(observer)
    }

    /**
     * Subscribe to mouse movement event
     * @param observer object with an onMouseMovement method
     */
    static subscribeToMove(observer:MouseMoveObserver){
        Mouse.instance._moveObservers.add(observer)
    }

    /**
     * Unsubscribe from mouse click event
     * @param observer object to no longer propagate events to
     */
    static unsubscribeFromClick(observer:MouseClickObserver){
        Mouse.instance._clickObservers.delete(observer)
    }

    /**
     * Unsubscribe from mouse move events
     * @param observer object to no longer propagate events to
     */
    static unsubscribeFromMove(observer:MouseMoveObserver){
        Mouse.instance._moveObservers.delete(observer)
    }

    /** receive and propagate a mouse click event */
    static click() {
        if(!GameStateManager.paused)
            Mouse.instance._clickObservers.forEach((observer) => {
                observer.onClick()
            })
    }

    /**
     * receive and propagate a mouse move event
     * @param event the mouse event
     */
    static move(event: React.MouseEvent<HTMLDivElement>) {
        if( GameStateManager.state !== GameState.Active)
            return

         Mouse.instance._position = [
            Mouse.instance._position[0] + event.movementX * Mouse.instance._sensitivity,
            Mouse.instance._position[1] + event.movementY * Mouse.instance._sensitivity
        ]

         Mouse.clampMouse()
        
        Mouse._instance._moveObservers.forEach((observer) => {
            observer.onMouseMove(event)
        })
    }

    /** clamp mouse position to within its bounds */
    private static clampMouse() {
        if (Mouse._instance._bounds)
            Mouse._instance._position = [
                Math.max(Mouse._instance._bounds.left, Math.min(Mouse._instance._bounds.right, Mouse._instance._position[0])),
                Math.max(Mouse._instance._bounds.top, Math.min(Mouse._instance._bounds.bottom, Mouse._instance._position[1])),
            ]
    }

}