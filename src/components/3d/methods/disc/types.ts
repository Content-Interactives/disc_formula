export interface DiscMethodProps {
    userFunctions: string[]
    lowerBound: number
    upperBound: number
    isRotating: boolean
    showDiscs: boolean
    onRotationComplete: () => void
}

export interface DiscData {
    position: [number, number, number]
    rotation: [number, number, number]
    radius: number
    height: number
}

export interface DiscPhase {
    stepSize: number
    speed: number
} 