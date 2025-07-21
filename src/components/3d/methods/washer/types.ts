export interface WasherMethodProps {
    userFunctions: string[]
    lowerBound: number
    upperBound: number
    isRotating: boolean
    showWashers: boolean
    onRotationComplete: () => void
}

export interface WasherData {
    position: [number, number, number]
    rotation: [number, number, number]
    outerRadius: number
    innerRadius: number
    height: number
}

export interface WasherPhase {
    stepSize: number
    speed: number
} 