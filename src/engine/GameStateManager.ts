import { SceneManager } from "./SceneManager"
import { GameState } from "./GameState"
import { Menu } from "./menu/Menu"
import { Rectangle } from "./Rectangle"
import { Clock, TimerId } from "./timing"

/** Singleton responsible for managing the state of the game */
export class GameStateManager {

    /** Singleton instance */
    private static _instance: GameStateManager

    /** whether the game is paused */
    private _paused: boolean = true
    /** whether the game is pauseLocked */
    private _pauseLocked: boolean = false
    /** the current state of the game */
    private _state: GameState = GameState.Menu
    /** timers that will be paused when the game is paused */
    private _timers: TimerId[] = []

    /** the current scene manager */
    private _sceneManager: SceneManager

    /** All of the possible menus to display */
    private _menus: { [key: string]: Menu } = {}
    /** The current menu to display */
    private _menu: Menu

    /** The current enemy wave */
    private _wave = 0

    /** Constructor */
    private constructor() {
        //create a scene manager
        this._sceneManager = new SceneManager(new Rectangle(0, 0, 640, 480))

        //create the menus
        this._menus = {
            TitleScreen: new Menu('Martian Invaders', [
                { label: 'Start Game', action: GameStateManager.startGame },
            ]),
            Pause: new Menu('Paused', [
                { label: 'Resume', action: GameStateManager.unpause },
                { label: 'Exit to Main Menu', action: GameStateManager.reset }
            ]),
            GameOver: new Menu('Game Over', [
                { label: 'Back to Main Menu', action: GameStateManager.reset }
            ]),
            Victory: new Menu('Victory', [
                { label: 'Back to Main Menu', action: GameStateManager.reset }
            ])
        }
        //set the current menu visible, others hidden
        this._menus.TitleScreen.show()
        this._menus.Pause.hide()
        this._menus.GameOver.hide()
        this._menus.Victory.hide()
        this._menu = this._menus.TitleScreen
    }

    /** Get the current singleton instance, create it if needed */
    private static get instance() {
        if (!GameStateManager._instance) {
            GameStateManager._instance = new GameStateManager()
            GameStateManager.addTimer(GameStateManager._instance._sceneManager.timer)
        }

        return GameStateManager._instance
    }

    /** All possible menus to display */
    static get menus() { return GameStateManager.instance._menus }
    /** The current menu to display */
    static get menu() { return GameStateManager.instance._menu }

    static set menu(menu: Menu) {
        GameStateManager.instance._menu.hide()
        GameStateManager.instance._menu = menu
        menu.show()
    }

    /** The current scene manager */
    static get sceneManager() { return GameStateManager.instance._sceneManager }

    /** whether the pause state is locked due to pointerLock delay */
    static get pauseLocked() { return GameStateManager.instance._pauseLocked }
    static set pauseLocked(pauseLock: boolean) {
        GameStateManager.instance._pauseLocked = pauseLock
    }

    /** whether the game is currently paused */
    static get paused() { return GameStateManager.instance._paused }
    static set paused(pause: boolean) {
        GameStateManager.instance._paused = pause
    }

    /** The current state of the game */
    static get state() { return GameStateManager.instance._state }
    static set state(state: GameState) {
        GameStateManager.instance._state = state
    }

    /** Pause the game */
    static pause() {
        GameStateManager.paused = true
        GameStateManager.pauseLocked = true
        Clock.setTimer({ action: () => { GameStateManager.instance._pauseLocked = false }, duration: 1500, count: 1 })
        GameStateManager.instance._timers.forEach((timer) => {
            Clock.pauseTimer(timer)
        })
        GameStateManager.instance._menu.show()
        document.exitPointerLock()
    }

    /** Unpause the game */
    static unpause() {
        if (GameStateManager.instance._pauseLocked)
            return
        GameStateManager.instance._paused = false
        GameStateManager.instance._timers.forEach((timer) => {
            Clock.unpauseTimer(timer)
        })
        GameStateManager.instance._menu.hide()
        document.getElementById("game-canvas")?.requestPointerLock()
    }

    /** Start the game from the title screen */
    static startGame() {
        GameStateManager.state = GameState.Active
        GameStateManager.menu = GameStateManager.menus.Pause
        GameStateManager.menu.hide()
        GameStateManager.startNextWave()
        GameStateManager.unpause()
    }

    /** go to Game Over screen */
    static endGame() {
        GameStateManager.state = GameState.GameOver
        GameStateManager.menu = GameStateManager.menus.GameOver
        GameStateManager.pause()
    }

    /** Go back to title screen and reset */
    static reset() {
        GameStateManager.state = GameState.Menu
        GameStateManager.menu = GameStateManager.menus.TitleScreen
        GameStateManager.removeTimer(GameStateManager.instance._sceneManager.timer)
        GameStateManager.instance._sceneManager = new SceneManager(new Rectangle(0, 0, 640, 480))
        GameStateManager.addTimer(GameStateManager.instance._sceneManager.timer)
        GameStateManager.instance._menus.GameOver.hide()
        GameStateManager.instance._wave = 0
    }

    /**
     * Add a timer to pause when the game is paused
     * @param timer id of the timer to control
     */
    static addTimer(timer: TimerId) {
        GameStateManager.instance._timers.push(timer)
    }

    /** 
     * Remove a timer to pause when the game is paused 
     * @param timer id of the timer to stop controlling
     */
    static removeTimer(timer: TimerId) {
        GameStateManager.instance._timers = GameStateManager.instance._timers.filter((id) => id !== timer)
    }

    /** start the next enemy wave */
    static startNextWave() {
        if (GameStateManager.instance._sceneManager.addWave(GameStateManager.instance._wave)) {
            const element = document.getElementById("wave")
            console.log(element)
            element!.innerHTML = `<h1>Wave ${GameStateManager.instance._wave + 1}</h1>`
            element?.classList.remove('hidden')
            Clock.setTimer(
                {
                    action: () => { element?.classList.add('hidden') },
                    duration: 2000,
                    count: 1
                }
            )
            GameStateManager.instance._wave += 1
        }
        else {
            GameStateManager.state = GameState.Victory
            GameStateManager.menu = GameStateManager.menus.Victory
            GameStateManager.pause()
        }
    }
}