import { evaluate } from 'mathjs'

export const calculateDiscVolume = (
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
            const radius = Math.abs(y)
            
            // Volume of disc: π * r² * thickness
            // V = π ∫[a to b] [f(x)]² dx
            volume += Math.PI * radius * radius * stepSize
        }
    } catch (e) {
        console.warn('Error calculating disc volume:', e)
        return 0
    }
    
    return volume
}

export const calculatePartialDiscVolume = (
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
            const radius = Math.abs(y)
            volume += Math.PI * radius * radius * stepSize
        }
    } catch (e) {
        return 0
    }
    
    return volume
} 