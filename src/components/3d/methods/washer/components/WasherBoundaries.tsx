import React from 'react'
import { Line } from '@react-three/drei'
import { evalFn2D } from '../../../../utils/mathUtils'
import { COLORS } from '../../../../utils/colors'
import { WASHER_COLORS } from '../config'

interface WasherBoundariesProps {
    outerFn: string
    innerFn: string
    lowerBound: number
    upperBound: number
}

const WasherBoundaries: React.FC<WasherBoundariesProps> = ({ 
    outerFn, 
    innerFn, 
    lowerBound, 
    upperBound 
}) => {
    const lowerOuter = evalFn2D(outerFn, lowerBound)
    const lowerInner = evalFn2D(innerFn, lowerBound)
    const upperOuter = evalFn2D(outerFn, upperBound)
    const upperInner = evalFn2D(innerFn, upperBound)

    return (
        <>
            {/* Lower bound boundaries */}
            {/* Line from inner function to outer function at lower bound */}
            <Line 
                points={[[lowerBound, lowerInner, 0], [lowerBound, lowerOuter, 0]]}
                color={COLORS.lowerBound} 
                lineWidth={8} 
                transparent={true}
                opacity={0.8} 
            />
            
            {/* Upper bound boundaries */}
            {/* Line from inner function to outer function at upper bound */}
            <Line 
                points={[[upperBound, upperInner, 0], [upperBound, upperOuter, 0]]}
                color={COLORS.upperBound} 
                lineWidth={8} 
                transparent={true}
                opacity={0.8} 
            />
            
            {/* Optional: Show the gap more clearly with additional indicators */}
            <Line 
                points={[[lowerBound, lowerInner, 0], [lowerBound, lowerInner - 0.1, 0]]}
                color={WASHER_COLORS.inner} 
                lineWidth={4} 
                transparent={true}
                opacity={0.9} 
            />
            
            <Line 
                points={[[lowerBound, lowerOuter, 0], [lowerBound, lowerOuter + 0.1, 0]]}
                color={WASHER_COLORS.outer} 
                lineWidth={4} 
                transparent={true}
                opacity={0.9} 
            />
            
            <Line 
                points={[[upperBound, upperInner, 0], [upperBound, upperInner - 0.1, 0]]}
                color={WASHER_COLORS.inner} 
                lineWidth={4} 
                transparent={true}
                opacity={0.9} 
            />
            
            <Line 
                points={[[upperBound, upperOuter, 0], [upperBound, upperOuter + 0.1, 0]]}
                color={WASHER_COLORS.outer} 
                lineWidth={4} 
                transparent={true}
                opacity={0.9} 
            />
        </>
    )
}

export default WasherBoundaries 