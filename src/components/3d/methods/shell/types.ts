export interface ShellMethodProps {
    userFunctions: string[]
    lowerBound: number
    upperBound: number
    isRotating: boolean
    showShells: boolean
    onRotationComplete: () => void
}

export interface ShellData {
    position: [number, number, number]
    rotation: [number, number, number]
    radius: number
    height: number
    thickness: number
}

export interface ShellPhase {
    stepSize: number
    speed: number
} 