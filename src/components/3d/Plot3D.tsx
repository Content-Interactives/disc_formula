import React from "react"
import Scene from "./core/Scene"
import VisualizationManager from "./VisualizationManager"
import type { MethodType } from "./config/methodConfig"

interface Plot3DProps {
    method?: MethodType
    userFunctions: string[]  // Changed from userFn to userFunctions array
    lowerBound: number
    upperBound: number
    graphSize?: number
    rotationBtn: boolean
    discBtn: boolean
    volumeTrackerBtn?: boolean
    toggleRotate: (value: boolean) => void
    onRotationComplete?: () => void  // NEW: Add completion callback
}

const Plot3D: React.FC<Plot3DProps> = ({ 
    method = 'disc',  // Default to disc method
    userFunctions, 
    lowerBound, 
    upperBound,
    graphSize = 100,
    rotationBtn = false,
    discBtn = false,
    volumeTrackerBtn = false,
    toggleRotate,
    onRotationComplete,  // NEW: Accept completion callback
}) => {
    return (
        <Scene graphSize={graphSize}>
            <VisualizationManager
                method={method}
                userFunctions={userFunctions}
                lowerBound={lowerBound}
                upperBound={upperBound}
                isRotating={rotationBtn}
                showElements={discBtn}
                onRotationComplete={onRotationComplete || (() => {})}  // NEW: Pass callback with fallback
            />
        </Scene>
    )
}

export default Plot3D
