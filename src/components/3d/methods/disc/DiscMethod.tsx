import React, { useState, useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Line, Cylinder } from "@react-three/drei"
import { Group } from 'three'
import { generateFunctionPoints, evalFn3D } from '../../../utils/mathUtils'
import type { DiscMethodProps, DiscData } from './types'
import { DISC_PHASES, DISC_ROTATION_SPEED, DISC_TRAIL_COUNT } from './config'
import DiscSurface from './components/DiscSurface'
import DiscBoundaries from './components/DiscBoundaries'
import { calculatePartialDiscVolume } from './utils/volumeCalculator'

const DiscMethod: React.FC<DiscMethodProps> = ({
    userFunctions,
    lowerBound,
    upperBound,
    isRotating,
    showDiscs,
    onRotationComplete
}) => {
    const [showSurface, setShowSurface] = useState(false)
    const [trailRotations, setTrailRotations] = useState<number[]>([])
    
    // Rotation logic
    const groupRef = useRef<Group>(null)
    const targetRotation = useRef(0)
    
    // Disc animation logic
    const [visibleDiscs, setVisibleDiscs] = useState(0)
    const [phase, setPhase] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [currentVolume, setCurrentVolume] = useState(0)
    
    const userFn = userFunctions[0] || "x"  // Get first function for disc method

    // Reset when active changes
    useEffect(() => {
        if (!showDiscs) {
            setVisibleDiscs(0)
            setPhase(0)
            setIsComplete(false)
            setCurrentVolume(0)
        }
    }, [showDiscs])

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
            groupRef.current.rotation.x += delta * DISC_ROTATION_SPEED
            
            // Add trail every 15 degrees
            const rotationStep = Math.PI / DISC_TRAIL_COUNT
            if (Math.floor(groupRef.current.rotation.x / rotationStep) > 
                Math.floor(oldRotation / rotationStep)) {
                
                setTrailRotations(prev => {
                    const newTrails = [oldRotation, ...prev]
                    return newTrails.slice(0, DISC_TRAIL_COUNT) // Keep only recent trails
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

        // Handle disc animation with volume calculation
        if (showDiscs && !isComplete) {
            const currentPhase = DISC_PHASES[phase]
            const discs: DiscData[] = []
            
            try {
                for (let x = lowerBound; x <= upperBound; x += currentPhase.stepSize) {
                    const baseRadius = Math.abs(evalFn3D(userFn, x))
                    discs.push({
                        position: [x, 0, 0] as [number, number, number],
                        rotation: [0, 0, Math.PI/2] as [number, number, number],
                        radius: baseRadius,
                        height: currentPhase.stepSize
                    })
                }
                
                // Calculate current volume
                if (discs.length > 0) {
                    const currentX = lowerBound + ((upperBound - lowerBound) * visibleDiscs) / discs.length
                    setCurrentVolume(calculatePartialDiscVolume(userFn, lowerBound, currentX, currentPhase.stepSize))
                }
            } catch (e) {
                // Handle function evaluation errors
            }

            if (visibleDiscs < discs.length) {
                setVisibleDiscs(prev => prev + currentPhase.speed)
            } else if (phase < DISC_PHASES.length - 1) {
                setVisibleDiscs(0)
                setPhase(prev => prev + 1)
            } else {
                setIsComplete(true)
            }
        }
    })

    // Generate discs for current phase
    const discs = React.useMemo(() => {
        if (!showDiscs) return []
        
        const arr: DiscData[] = []
        const stepSize = DISC_PHASES[phase]?.stepSize || 0.1
        
        try {
            for (let x = lowerBound; x <= upperBound; x += stepSize) {
                const baseRadius = Math.abs(evalFn3D(userFn, x))
                arr.push({
                    position: [x, 0, 0] as [number, number, number],
                    rotation: [0, 0, Math.PI/2] as [number, number, number],
                    radius: baseRadius,
                    height: stepSize
                })
            }
            return arr
        } catch (e) { return [] }
    }, [userFn, lowerBound, upperBound, phase, showDiscs])

    return (
        <>
            {/* Trail copies - each trail is a copy of all children */}
            {trailRotations.map((rotation, i) => (
                <group key={`trail-${i}`} rotation={[rotation, 0, 0]}>
                    <Line 
                        points={generateFunctionPoints(userFn, lowerBound, upperBound)}
                        color="yellow"
                        lineWidth={2}
                        transparent={true}
                        opacity={0.8}
                    />
                    <DiscBoundaries 
                        userFn={userFn}
                        lowerBound={lowerBound}
                        upperBound={upperBound}
                    />
                </group>
            ))}
            
            {/* Current rotating function */}
            <group ref={groupRef}>
                <Line 
                    points={generateFunctionPoints(userFn, lowerBound, upperBound)}
                    color="yellow"
                    lineWidth={2}
                    transparent={true}
                    opacity={0.8}
                />
                <DiscBoundaries 
                    userFn={userFn}
                    lowerBound={lowerBound}
                    upperBound={upperBound}
                />
            </group>

            {/* Specialized Disc Surface */}
            <DiscSurface
                userFn={userFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
                active={showSurface}
            />

            {/* Disc Animation */}
            {showDiscs && (
                <group>
                    {discs.slice(0, Math.floor(visibleDiscs)).map((disc, i) => (
                        <React.Fragment key={i}>
                            <Cylinder
                                position={disc.position}
                                rotation={disc.rotation}
                                args={[disc.radius, disc.radius, disc.height, 32]}
                            >
                                <meshPhysicalMaterial
                                    color="black"
                                    metalness={0.7}
                                    roughness={0.4}
                                    opacity={1}
                                    transparent={false}
                                />
                            </Cylinder>

                            <Cylinder
                                position={disc.position}
                                rotation={disc.rotation}
                                args={[disc.radius * 0.5, disc.radius * 0.5, disc.height * 1.01, 32]}
                            >
                                <meshStandardMaterial
                                    color="#FFD700"
                                    metalness={0}
                                    roughness={0.5}
                                />
                            </Cylinder>
                        </React.Fragment>
                    ))}
                </group>
            )}
            
            {/* Debug volume display */}
            {showDiscs && currentVolume > 0 && (
                <mesh position={[upperBound + 1, 2, 0]}>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshBasicMaterial color="white" />
                </mesh>
            )}
        </>
    )
}

export default DiscMethod 