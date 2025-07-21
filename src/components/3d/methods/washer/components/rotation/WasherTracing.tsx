import React, { useRef } from 'react'
import { Line } from '@react-three/drei'
import { Group } from 'three'
import { evalFn3D } from '../../../../../utils/mathUtils'
import WasherBoundaries from './WasherBoundaries'

interface WasherTracingProps {
    outerFn: string
    innerFn: string
    lowerBound: number
    upperBound: number
    trailRotations: number[]
    groupRef: React.RefObject<Group | null>
}

const WasherTracing: React.FC<WasherTracingProps> = ({
    outerFn,
    innerFn,
    lowerBound,
    upperBound,
    trailRotations,
    groupRef
}) => {
    // Generate function points for actual outer and inner radii
    const generateWasherFunctionPoints = (isOuter: boolean) => {
        const points: [number, number, number][] = []
        const steps = 100
        
        try {
            for (let i = 0; i <= steps; i++) {
                const x = lowerBound + ((upperBound - lowerBound) * i) / steps
                const func1Value = Math.abs(evalFn3D(outerFn, x))
                const func2Value = Math.abs(evalFn3D(innerFn, x))
                
                const radius = isOuter 
                    ? Math.max(func1Value, func2Value)  // Outer radius = larger value
                    : Math.min(func1Value, func2Value)  // Inner radius = smaller value
                
                points.push([x, radius, 0])
            }
        } catch (e) {
            console.warn('Error generating washer function points:', e)
        }
        
        return points
    }

    return (
        <>
            {/* Trail copies - each trail is a copy of all children */}
            {trailRotations.map((rotation, i) => (
                <group key={`trail-${i}`} rotation={[rotation, 0, 0]}>
                    <Line 
                        points={generateWasherFunctionPoints(true)}
                        color="#FF6B6B"
                        lineWidth={2}
                        transparent={true}
                        opacity={0.5}
                    />
                    <Line 
                        points={generateWasherFunctionPoints(false)}
                        color="#4ECDC4"
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
            
            {/* Current rotating function */}
            <group ref={groupRef}>
                <Line 
                    points={generateWasherFunctionPoints(true)}
                    color="#FF6B6B"
                    lineWidth={2}
                    transparent={true}
                    opacity={0.8}
                />
                <Line 
                    points={generateWasherFunctionPoints(false)}
                    color="#4ECDC4"
                    lineWidth={2}
                    transparent={true}
                    opacity={0.8}
                />
                <WasherBoundaries 
                    outerFn={outerFn}
                    innerFn={innerFn}
                    lowerBound={lowerBound}
                    upperBound={upperBound}
                />
            </group>
        </>
    )
}

export default WasherTracing 