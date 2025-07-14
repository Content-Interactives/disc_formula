import { evaluate } from 'mathjs'

// Constants
export const FUNCTION_STEP_SIZE = 0.1
export const ROTATION_SPEED = 2
export const TRAIL_STEP = Math.PI / 12  // 15 degrees
export const DEFAULT_MAX_TRAILS = 24

// Utility function for safe function evaluation
/*
Single point calculations
*/
export const evalFn = (func: string, x: number): number => {
    try {
        const y = evaluate(func, { x }) as number
        return Math.abs(y)  // Return absolute value for radius
    } catch (e) {
        console.warn(`Error evaluating function at x=${x}:`, e)
        return Math.abs(x)  // Fallback to |x|
    }
}

// Utility function for bounds calculation
export const getBounds = (a: number, b: number) => {
    return {
        lower: Math.min(a, b),
        upper: Math.max(a, b)
    }
}

// Make points on the curve, to 2D function
export const generateFunctionPoints = (
    func: string, 
    a: number, 
    b: number, 
    stepSize: number = FUNCTION_STEP_SIZE
): [number, number, number][] => {
    const { lower, upper } = getBounds(a, b)
    const numSteps = Math.floor((upper - lower) / stepSize)
    const points: [number, number, number][] = []
    
    for (let i = 0; i <= numSteps; i++) {
        const x = lower + i * stepSize
        const y = evalFn(func, x)
        points.push([x, y, 0])
    }
    
    return points
}

// makes 3D shape
export const generateCurvePoints = (
    func: string, 
    a: number, 
    b: number, 
    stepSize: number = FUNCTION_STEP_SIZE
) => {
    const { lower, upper } = getBounds(a, b)
    const numSteps = Math.floor((upper - lower) / stepSize)
    const points: { x: number; radius: number }[] = []
    
    for (let i = 0; i <= numSteps; i++) {
        const x = lower + i * stepSize
        const radius = evalFn(func, x)
        
        if (radius > 0) {
            points.push({ x, radius })
        }
    }
    
    return points
}