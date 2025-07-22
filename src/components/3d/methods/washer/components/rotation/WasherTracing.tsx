import React, { useRef, useMemo } from 'react'
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
    // Memoized function points calculation - much more efficient!
    const { outerPoints, innerPoints } = useMemo(() => {
        const outer: [number, number, number][] = []
        const inner: [number, number, number][] = []
        
        // Use fewer steps for better performance (match other methods)
        const stepSize = 0.1  // Same as other methods instead of 100 steps
        const steps = Math.floor((upperBound - lowerBound) / stepSize)
        
        try {
            for (let i = 0; i <= steps; i++) {
                const x = lowerBound + (i * stepSize)
                const func1Value = Math.abs(evalFn3D(outerFn, x))
                const func2Value = Math.abs(evalFn3D(innerFn, x))
                
                // Calculate once, use twice
                const outerRadius = Math.max(func1Value, func2Value)
                const innerRadius = Math.min(func1Value, func2Value)
                
                outer.push([x, outerRadius, 0])
                inner.push([x, innerRadius, 0])
            }
        } catch (e) {
            console.warn('Error generating washer function points:', e)
        }
        
        return { outerPoints: outer, innerPoints: inner }
    }, [outerFn, innerFn, lowerBound, upperBound])  // Only recalculate when these change

    return (
        <>
            {/* Trail copies - reuse memoized points */}
            {trailRotations.map((rotation, i) => (
                <group key={`trail-${i}`} rotation={[rotation, 0, 0]}>
                    <Line 
                        points={outerPoints}
                        color="#FF6B6B"
                        lineWidth={2}
                        transparent={true}
                        opacity={0.5}
                    />
                    <Line 
                        points={innerPoints}
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
            
            {/* Current rotating function - reuse memoized points */}
            <group ref={groupRef}>
                <Line 
                    points={outerPoints}
                    color="#FF6B6B"
                    lineWidth={2}
                    transparent={true}
                    opacity={0.8}
                />
                <Line 
                    points={innerPoints}
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