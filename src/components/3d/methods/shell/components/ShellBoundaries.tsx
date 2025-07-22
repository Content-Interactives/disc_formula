import React from 'react'
import { Line } from '@react-three/drei'
import { evalFn2D } from '../../../../utils/mathUtils'
import { COLORS } from '../../../../utils/colors'

interface ShellBoundariesProps {
    userFn: string
    lowerBound: number
    upperBound: number
}

const ShellBoundaries: React.FC<ShellBoundariesProps> = ({ userFn, lowerBound, upperBound }) => {
    return (
        <>
            {/* Lower bound - vertical line from 0 to f(a) */}
            <Line 
                points={[[lowerBound, 0, 0], [lowerBound, evalFn2D(userFn, lowerBound), 0]]}
                color={COLORS.lowerBound} 
                lineWidth={6} 
                transparent={true}
                opacity={0.7} 
            />
            
            {/* Upper bound - vertical line from 0 to f(b) */}
            <Line 
                points={[[upperBound, 0, 0], [upperBound, evalFn2D(userFn, upperBound), 0]]}
                color={COLORS.upperBound} 
                lineWidth={6} 
                transparent={true}
                opacity={0.7} 
            />
        </>
    )
}

export default ShellBoundaries 