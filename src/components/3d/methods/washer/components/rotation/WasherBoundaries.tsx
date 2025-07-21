import React from 'react'
import { Line } from '@react-three/drei'
import { evalFn3D } from '../../../../../utils/mathUtils'
import { COLORS } from '../../../../../utils/colors'

interface WasherBoundariesProps {
    outerFn: string
    innerFn: string
    lowerBound: number
    upperBound: number
}

const WasherBoundaries: React.FC<WasherBoundariesProps> = ({ outerFn, innerFn, lowerBound, upperBound }) => {
    // Calculate the actual outer and inner radii at bounds
    const lowerOuterValue = Math.abs(evalFn3D(outerFn, lowerBound))
    const lowerInnerValue = Math.abs(evalFn3D(innerFn, lowerBound))
    const lowerActualOuter = Math.max(lowerOuterValue, lowerInnerValue)
    const lowerActualInner = Math.min(lowerOuterValue, lowerInnerValue)

    const upperOuterValue = Math.abs(evalFn3D(outerFn, upperBound))
    const upperInnerValue = Math.abs(evalFn3D(innerFn, upperBound))
    const upperActualOuter = Math.max(upperOuterValue, upperInnerValue)
    const upperActualInner = Math.min(upperOuterValue, upperInnerValue)

    return (
        <>
            {/* Lower bound - from inner to outer radius (shows washer thickness) */}
            <Line 
                points={[[lowerBound, lowerActualInner, 0], [lowerBound, lowerActualOuter, 0]]}
                color={COLORS.lowerBound} 
                lineWidth={6} 
                transparent={true}
                opacity={0.8} 
            />
            
            {/* Upper bound - from inner to outer radius (shows washer thickness) */}
            <Line 
                points={[[upperBound, upperActualInner, 0], [upperBound, upperActualOuter, 0]]}
                color={COLORS.upperBound} 
                lineWidth={6} 
                transparent={true}
                opacity={0.8} 
            />
        </>
    )
}

export default WasherBoundaries 