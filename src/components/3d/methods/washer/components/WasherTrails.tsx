import React from 'react'
import { Line } from '@react-three/drei'
import { generateFunctionPoints } from '../../../../utils/mathUtils'
import { WASHER_COLORS } from '../config'
import WasherBoundaries from './WasherBoundaries'

interface WasherTrailsProps {
    trailRotations: number[]
    outerFn: string
    innerFn: string
    lowerBound: number
    upperBound: number
}

const WasherTrails: React.FC<WasherTrailsProps> = ({
    trailRotations,
    outerFn,
    innerFn,
    lowerBound,
    upperBound
}) => {
    if (trailRotations.length === 0) return null

    return (
        <>
            {trailRotations.map((rotation, i) => (
                <group key={`trail-${i}`} rotation={[rotation, 0, 0]}>
                    <Line 
                        points={generateFunctionPoints(outerFn, lowerBound, upperBound, 20)}
                        color={WASHER_COLORS.outer}
                        lineWidth={2}
                        transparent={true}
                        opacity={0.5}
                    />
                    <Line 
                        points={generateFunctionPoints(innerFn, lowerBound, upperBound, 20)}
                        color={WASHER_COLORS.inner}
                        lineWidth={2}
                        transparent={true}
                        opacity={0.5}
                    />
                    <WasherBoundaries 
                        outerFn={outerFn}
                        innerFn={innerFn}
                        lowerBound={lowerBound}
                        upperBound={upperBound}
                    />
                </group>
            ))}
        </>
    )
}

export default WasherTrails 