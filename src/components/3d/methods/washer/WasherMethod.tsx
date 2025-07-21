import React, { useState, useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import { Group } from 'three'
import { generateFunctionPoints, evalFn3D } from '../../../utils/mathUtils'
import type { WasherMethodProps, WasherData } from './types'
import { WASHER_PHASES, WASHER_ROTATION_SPEED, WASHER_TRAIL_COUNT, WASHER_COLORS } from './config'
import WasherSurface from './components/WasherSurface'
import WasherBoundaries from './components/WasherBoundaries'
import HollowWasher from './components/HollowWasher'
import { calculatePartialWasherVolume } from './utils/volumeCalculator'

const WasherMethod: React.FC<WasherMethodProps> = ({
    userFunctions,
    lowerBound,
    upperBound,
    isRotating,
    showWashers,
    onRotationComplete
}) => {
    const [showSurface, setShowSurface] = useState(false)
    const [trailRotations, setTrailRotations] = useState<number[]>([])
    
    // Rotation logic
    const groupRef = useRef<Group>(null)
    const targetRotation = useRef(0)
    
    // Washer animation logic
    const [visibleWashers, setVisibleWashers] = useState(0)
    const [phase, setPhase] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [currentVolume, setCurrentVolume] = useState(0)
    
    const outerFn = userFunctions[0] || "2*x"  // Outer function
    const innerFn = userFunctions[1] || "x"    // Inner function

    // Reset when active changes
    useEffect(() => {
        if (!showWashers) {
            setVisibleWashers(0)
            setPhase(0)
            setIsComplete(false)
            setCurrentVolume(0)
        }
    }, [showWashers])

    useEffect(() => {
        if (isRotating && groupRef.current) {
            targetRotation.current = groupRef.current.rotation.x + Math.PI * 2
            setTrailRotations([]) // Clear trails
        }
    }, [isRotating])
    
    useFrame((_, delta) => {
        // Handle rotation
        if (isRotating && groupRef.current) {
            const oldRotation = groupRef.current.rotation.x
            groupRef.current.rotation.x += delta * WASHER_ROTATION_SPEED
            
            // Add trail every 30 degrees instead of 15 for better performance
            const rotationStep = Math.PI / (WASHER_TRAIL_COUNT / 2)
            if (Math.floor(groupRef.current.rotation.x / rotationStep) > 
                Math.floor(oldRotation / rotationStep)) {
                
                setTrailRotations(prev => {
                    const newTrails = [oldRotation, ...prev]
                    return newTrails.slice(0, Math.floor(WASHER_TRAIL_COUNT / 2)) // Fewer trails
                })
            }
            
            // When rotation completes
            if (groupRef.current.rotation.x >= targetRotation.current) {
                groupRef.current.rotation.x = targetRotation.current
                setTrailRotations([])  // Clear trails
                setShowSurface(true)   // Show surface
                onRotationComplete()   // Notify parent
            }
        }

        // Handle washer animation with volume calculation
        if (showWashers && !isComplete) {
            const currentPhase = WASHER_PHASES[phase]
            
            try {
                // Simplified volume calculation - only when needed
                if (visibleWashers % 5 === 0) { // Update volume less frequently
                    const currentX = lowerBound + ((upperBound - lowerBound) * visibleWashers) / 50
                    setCurrentVolume(calculatePartialWasherVolume(outerFn, innerFn, lowerBound, currentX, currentPhase.stepSize))
                }
            } catch (e) {
                console.warn('Error in washer animation:', e)
            }

            // Simplified animation progression
            if (visibleWashers < 50) { // Fixed number instead of calculating each time
                setVisibleWashers(prev => prev + currentPhase.speed)
            } else if (phase < WASHER_PHASES.length - 1) {
                setVisibleWashers(0)
                setPhase(prev => prev + 1)
            } else {
                setIsComplete(true)
            }
        }
    })

    // Generate washers for current phase - memoized and simplified
    const washers = React.useMemo(() => {
        if (!showWashers) return []
        
        const arr: WasherData[] = []
        const stepSize = WASHER_PHASES[phase]?.stepSize || 0.2 // Larger step size for better performance
        
        try {
            for (let x = lowerBound; x <= upperBound; x += stepSize) {
                const outerRadius = Math.abs(evalFn3D(outerFn, x))
                const innerRadius = Math.abs(evalFn3D(innerFn, x))
                
                if (outerRadius > innerRadius) {
                    arr.push({
                        position: [x, 0, 0] as [number, number, number],
                        rotation: [0, 0, Math.PI/2] as [number, number, number],
                        outerRadius,
                        innerRadius,
                        height: stepSize
                    })
                }
            }
            return arr
        } catch (e) { 
            console.warn('Error generating washers:', e)
            return [] 
        }
    }, [outerFn, innerFn, lowerBound, upperBound, phase, showWashers])

    return (
        <>
            {/* Trail copies - reduced for performance */}
            {trailRotations.map((rotation, i) => (
                <group key={`trail-${i}`} rotation={[rotation, 0, 0]}>
                    {/* Outer function */}
                    <Line 
                        points={generateFunctionPoints(outerFn, lowerBound, upperBound, 20)} // Fewer points
                        color={WASHER_COLORS.outer}
                        lineWidth={2}
                        transparent={true}
                        opacity={0.5}
                    />
                    {/* Inner function */}
                    <Line 
                        points={generateFunctionPoints(innerFn, lowerBound, upperBound, 20)} // Fewer points
                        color={WASHER_COLORS.inner}
                        lineWidth={2}
                        transparent={true}
                        opacity={0.5}
                    />
                    {/* Simplified boundaries */}
                    <WasherBoundaries 
                        outerFn={outerFn}
                        innerFn={innerFn}
                        lowerBound={lowerBound}
                        upperBound={upperBound}
                    />
                </group>
            ))}
            
            {/* Current rotating functions */}
            <group ref={groupRef}>
                {/* Outer function */}
                <Line 
                    points={generateFunctionPoints(outerFn, lowerBound, upperBound, 30)} // Fewer points
                    color={WASHER_COLORS.outer}
                    lineWidth={3}
                    transparent={true}
                    opacity={1.0}
                />
                {/* Inner function */}
                <Line 
                    points={generateFunctionPoints(innerFn, lowerBound, upperBound, 30)} // Fewer points
                    color={WASHER_COLORS.inner}
                    lineWidth={3}
                    transparent={true}
                    opacity={1.0}
                />
                {/* Specialized Washer Boundaries */}
                <WasherBoundaries 
                    outerFn={outerFn}
                    innerFn={innerFn}
                    lowerBound={lowerBound}
                    upperBound={upperBound}
                />
            </group>

            {/* Simplified Washer Surface */}
            <WasherSurface
                outerFn={outerFn}
                innerFn={innerFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
                active={showSurface}
            />

            {/* Hollow Washer Core - shows the hollow center clearly */}
            {/* HollowWasherCore
                outerFn={outerFn}
                innerFn={innerFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
                active={showSurface}
                opacity={0.2}
            /> */}
            
            {/* Optimized Washer Animation */}
            {showWashers && (
                <group>
                    {washers.slice(0, Math.floor(visibleWashers)).map((washer, i) => (
                        <HollowWasher
                            key={i}
                            position={washer.position}
                            rotation={washer.rotation}
                            outerRadius={washer.outerRadius}
                            innerRadius={washer.innerRadius}
                            height={washer.height}
                            opacity={0.8}
                        />
                    ))}
                </group>
            )}
            
            {/* Volume display indicator */}
            {showWashers && currentVolume > 0 && (
                <mesh position={[upperBound + 1, 2, 0]}>
                    <sphereGeometry args={[0.1]} />
                    <meshBasicMaterial color={WASHER_COLORS.outer} />
                </mesh>
            )}
        </>
    )
}

export default WasherMethod 