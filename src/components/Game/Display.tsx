import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Vector } from "../../engine/Vector";
import { SpriteId, SpriteManager } from "../../engine/sprites";
import { Clock } from "../../engine/timing";

import { GameStateManager } from "../../engine/GameStateManager";

export interface DisplayProps {
    width: number,
    height: number
}

export const Display = forwardRef<HTMLCanvasElement, DisplayProps>(({ width, height }, ref) => {

    //////////////////////////////////////////////////////////////////////
    //State and Setup
    //////////////////////////////////////////////////////////////////////    
    const canvas = useRef<HTMLCanvasElement>(null)

    useImperativeHandle(ref, () => canvas.current!)

    useEffect(() => {
        if (canvas.current)
            document.addEventListener('pointerlockchange', onPointerLockChange)
        Clock.setTimer({ action: renderGame })
    }, [])

    const onPointerLockChange = () => {
        //pause
        if (document.pointerLockElement != canvas.current) {
            GameStateManager.pause()
        }
    }
    //////////////////////////////////////////////////////////////////////
    //Render
    //////////////////////////////////////////////////////////////////////

    const renderSprite = (context: CanvasRenderingContext2D, spriteId: SpriteId, position: Vector, frame?: number) => {
        const sprite = SpriteManager.get(spriteId)

        if (frame != undefined) {
            const src = sprite.getFrame(frame)
            context.drawImage(
                sprite.img,
                src.x / 2,
                src.y / 2,
                src.width / 2,
                src.height / 2,
                position[0] - src.width / 2,
                position[1] - src.height / 2,
                src.width,
                src.height)
        }
        else {
            context.drawImage(
                sprite.img,
                position[0] - sprite.width / 2,
                position[1] - sprite.height / 2,
                sprite.width,
                sprite.height
            )
        }
    }

    const renderGame = () => {

        const context = canvas.current?.getContext('2d')

        if (context)

            context.imageSmoothingEnabled = false

        context?.drawImage(SpriteManager.get(SpriteManager.BACKGROUND).img, 0, 0, context.canvas.width * devicePixelRatio, context.canvas.height * devicePixelRatio)

        GameStateManager.sceneManager.entities.forEach((entity) => {
            renderSprite(context!, entity.sprite, entity.position, entity.frame)
        })

    }

    return (
        <>
            <canvas id="game-canvas" ref={canvas} width={width} height={height} ></canvas>
            <div id='overlay'>
                <div id='wave' className='hidden'>
                    <h1>Wave 1</h1>
                </div>
            </div>
        </>
    )
},)