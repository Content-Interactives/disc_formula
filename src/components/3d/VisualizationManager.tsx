import React from "react"
import { DiscMethod } from "./methods/disc"
import { WasherMethod } from "./methods/washer"
import { ShellMethod } from "./methods/shell"
import type { MethodType } from "./config/methodConfig"

interface VisualizationManagerProps {
    method: MethodType
    userFunctions: string[]  // Changed from userFn to userFunctions array
    lowerBound: number
    upperBound: number
    isRotating: boolean
    showElements: boolean  // Generic - could be discs, washers, or shells
    onRotationComplete: () => void
}

const VisualizationManager: React.FC<VisualizationManagerProps> = ({
    method,
    userFunctions,
    lowerBound,
    upperBound,
    isRotating,
    showElements,
    onRotationComplete
}) => {
    const commonProps = {
        userFunctions,
        lowerBound,
        upperBound,
        isRotating,
        onRotationComplete
    }

    switch (method) {
        case 'disc':
            return (
                <DiscMethod 
                    {...commonProps}
                    showDiscs={showElements}
                />
            )
        case 'washer':
            return (
                <WasherMethod 
                    {...commonProps}
                    showWashers={showElements}
                />
            )
        case 'shell':
            return (
                <ShellMethod 
                    {...commonProps}
                    showShells={showElements}
                />
            )
        default:
            return null
    }
}

export default VisualizationManager 