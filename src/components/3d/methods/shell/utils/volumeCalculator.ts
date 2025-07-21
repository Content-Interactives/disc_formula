import { evaluate } from 'mathjs'

export const calculateShellVolume = (
    userFn: string,
    lowerBound: number,
    upperBound: number,
    stepSize: number = 0.01
): number => {
    let volume = 0
    
    try {
        for (let x = lowerBound; x <= upperBound; x += stepSize) {
            const y = evaluate(userFn, { x }) as number
            const height = Math.abs(y)
            const radius = Math.abs(x)  // For shell method, radius = x
            
            // Volume of cylindrical shell: 2π * radius * height * thickness
            // V = 2π ∫[a to b] x * f(x) dx
            volume += 2 * Math.PI * radius * height * stepSize
        }
    } catch (e) {
        console.warn('Error calculating shell volume:', e)
        return 0
    }
    
    return volume
}

export const calculatePartialShellVolume = (
    userFn: string,
    lowerBound: number,
    currentX: number,
    stepSize: number = 0.01
): number => {
    let volume = 0
    
    try {
        for (let x = lowerBound; x <= currentX; x += stepSize) {
            const y = evaluate(userFn, { x }) as number
            const height = Math.abs(y)
            const radius = Math.abs(x)
            
            volume += 2 * Math.PI * radius * height * stepSize
        }
    } catch (e) {
        return 0
    }
    
    return volume
} 