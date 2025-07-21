import React from 'react'
import { Line } from '@react-three/drei'
import { evalFn3D } from '../../../../utils/mathUtils'
import { COLORS } from '../../../../utils/colors'

interface ShellBoundariesProps {
    userFn: string
    lowerBound: number
    upperBound: number
}

const ShellBoundaries: React.FC<ShellBoundariesProps> = ({ userFn, lowerBound, upperBound }) => {
    // For shell method, we rotate around y-axis, so boundaries are different
    // The region is bounded by x = a, x = b, y = 0, and y = f(x)
    
    return (
        <>
            {/* Lower bound - vertical line at x = a from y = 0 to y = f(a) */}
            <Line 
                points={[[lowerBound, 0, 0], [lowerBound, evalFn3D(userFn, lowerBound), 0]]}
                color={COLORS.lowerBound} 
                lineWidth={6} 
                transparent={true}
                opacity={0.7} 
            />
            
            {/* Upper bound - vertical line at x = b from y = 0 to y = f(b) */}
            <Line 
                points={[[upperBound, 0, 0], [upperBound, evalFn3D(userFn, upperBound), 0]]}
                color={COLORS.upperBound} 
                lineWidth={6} 
                transparent={true}
                opacity={0.7} 
            />
            
            {/* Axis of rotation - horizontal line along x-axis */}
            <Line 
                points={[[lowerBound, 0, 0], [upperBound, 0, 0]]}
                color="#FFD700" 
                lineWidth={4} 
                transparent={true}
                opacity={0.5} 
            />
        </>
    )
}

export default ShellBoundaries 