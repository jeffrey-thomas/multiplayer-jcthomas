import { useFps } from "../../../engine/timing"


import './DebugDisplay.css'

export interface DebugDisplayProps {
    messages: string[]
}

export const DebugDisplay = ({ messages }: DebugDisplayProps) => {

    const [fps] = useFps()

    return (
        <div id='debug'>
            <span>{`FPS: ${fps}`}</span>
            <span>Press 'Esc' to pause.</span>
            {
                messages.map((message, index) => {
                    return <span key={`message${index}`}>{message}</span>
                })
            }
        </div>
    )
} 