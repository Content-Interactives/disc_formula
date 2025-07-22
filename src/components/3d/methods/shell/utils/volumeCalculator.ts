import { evaluate } from 'mathjs'

export const calculateShellVolume = (
    userFn: string,
    lowerBound: number,
    upperBound: number,
    stepSize: number = 0.01
): number => {
    // Ensure proper bounds order
    const minBound = Math.min(lowerBound, upperBound)
    const maxBound = Math.max(lowerBound, upperBound)
    
    let volume = 0
    
    try {
        for (let x = minBound; x <= maxBound; x += stepSize) {
            const y = evaluate(userFn, { x }) as number
            
            // Shell method: V = 2π ∫[a to b] x·f(x) dx
            // Each shell has radius = x, height = f(x), thickness = dx
            volume += 2 * Math.PI * x * Math.abs(y) * stepSize
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
    // Ensure proper bounds order
    const minBound = Math.min(lowerBound, currentX)
    const maxBound = Math.max(lowerBound, currentX)
    
    let volume = 0
    
    try {
        for (let x = minBound; x <= maxBound; x += stepSize) {
            const y = evaluate(userFn, { x }) as number
            
            // Shell method: V = 2π ∫[a to b] x·f(x) dx
            volume += 2 * Math.PI * x * Math.abs(y) * stepSize
        }
    } catch (e) {
        return 0
    }
    
    return volume
} 