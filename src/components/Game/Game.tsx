import { useCallback, useRef } from "react";

import './Game.css'
import { Mouse } from "../../engine/input/Mouse";
import { Display } from "./Display";

const screenW = 640;
const screenH = 480;

export const Game = () => {

    //////////////////////////////////////////////////////////////////////
    //State and Setup
    //////////////////////////////////////////////////////////////////////    
    const canvas = useRef<HTMLCanvasElement>(null)
    const container = useRef<HTMLDivElement>(null)

    //////////////////////////////////////////////////////////////////////
    //Event Listeners
    //////////////////////////////////////////////////////////////////////

    /**
     * Handle when the player clicks
     */
    const onClick = useCallback(() => {
        Mouse.click()
    }, [])

    /**
     * Handle when the player moves the mouse
     * @param event React.MouseEvent than contains movement information
     */
    const onMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        Mouse.move(event)
    }, [])

    return (
        <div id='game' ref={container} style={{ width: screenW, height:screenH }} onClick={onClick} onMouseMove={onMouseMove} >
            <Display ref={canvas} width={screenW} height={screenH}></Display>
        </div>
    )
}