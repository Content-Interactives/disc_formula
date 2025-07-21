import React from 'react'
import { Line } from '@react-three/drei'
import { Group } from 'three'
import { generateFunctionPoints } from '../../../../utils/mathUtils'
import { WASHER_COLORS } from '../config'
import WasherBoundaries from './WasherBoundaries'

interface WasherFunctionsProps {
    outerFn: string
    innerFn: string
    lowerBound: number
    upperBound: number
    groupRef: React.RefObject<Group | null>
}

const WasherFunctions: React.FC<WasherFunctionsProps> = ({
    outerFn,
    innerFn,
    lowerBound,
    upperBound,
    groupRef
}) => {
    return (
        <group ref={groupRef}>
            <Line 
                points={generateFunctionPoints(outerFn, lowerBound, upperBound, 30)}
                color={WASHER_COLORS.outer}
                lineWidth={3}
                transparent={true}
                opacity={1.0}
            />
            <Line 
                points={generateFunctionPoints(innerFn, lowerBound, upperBound, 30)}
                color={WASHER_COLORS.inner}
                lineWidth={3}
                transparent={true}
                opacity={1.0}
            />
            <WasherBoundaries 
                outerFn={outerFn}
                innerFn={innerFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
            />
        </group>
    )
}

export default WasherFunctions 