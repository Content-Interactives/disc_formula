import { evaluate } from 'mathjs'

export const calculateWasherVolume = (
    outerFn: string,
    innerFn: string,
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
            const outerY = evaluate(outerFn, { x }) as number
            const innerY = evaluate(innerFn, { x }) as number
            
            const outerRadius = Math.abs(outerY)
            const innerRadius = Math.abs(innerY)
            
            // Volume of washer: π * (R² - r²) * thickness
            // V = π ∫[a to b] ([R(x)]² - [r(x)]²) dx
            if (outerRadius > innerRadius) {
                volume += Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * stepSize
            }
        }
    } catch (e) {
        console.warn('Error calculating washer volume:', e)
        return 0
    }
    
    return volume
}

export const calculatePartialWasherVolume = (
    outerFn: string,
    innerFn: string,
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
            const outerY = evaluate(outerFn, { x }) as number
            const innerY = evaluate(innerFn, { x }) as number
            
            const outerRadius = Math.abs(outerY)
            const innerRadius = Math.abs(innerY)
            
            if (outerRadius > innerRadius) {
                volume += Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius) * stepSize
            }
        }
    } catch (e) {
        return 0
    }
    
    return volume
} 