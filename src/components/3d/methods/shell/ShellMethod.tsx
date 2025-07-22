import React, { useState, useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Line, Cylinder } from "@react-three/drei"
import { Group } from 'three'
import { generateFunctionPoints, evalFn3D } from '../../../utils/mathUtils'
import type { ShellMethodProps, ShellData } from './types'
import { SHELL_PHASES, SHELL_ROTATION_SPEED, SHELL_TRAIL_COUNT } from './config'
import ShellSurface from './components/ShellSurface'
import ShellBoundaries from './components/ShellBoundaries'
// import { calculatePartialShellVolume } from './utils/volumeCalculator'

const ShellMethod: React.FC<ShellMethodProps> = ({
    userFunctions,
    lowerBound,
    upperBound,
    isRotating,
    showShells,
    onRotationComplete
}) => {
    // Ensure proper bounds order (swap if needed)
    const minBound = Math.min(lowerBound, upperBound)
    const maxBound = Math.max(lowerBound, upperBound)
    
    const [showSurface, setShowSurface] = useState(false)
    const [trailRotations, setTrailRotations] = useState<number[]>([])
    
    // Rotation logic
    const groupRef = useRef<Group>(null)
    const targetRotation = useRef(0)
    
    // Shell animation logic
    const [visibleShells, setVisibleShells] = useState(0)
    const [phase, setPhase] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    // const [currentVolume, setCurrentVolume] = useState(0)
    
    const userFn = userFunctions[0] || "x"  // Get first function for shell method

    // Reset when active changes
    useEffect(() => {
        if (!showShells) {
            setVisibleShells(0)
            setPhase(0)
            setIsComplete(false)
            // setCurrentVolume(0)
        }
    }, [showShells])

    useEffect(() => {
        if (isRotating && groupRef.current) {
            targetRotation.current = groupRef.current.rotation.y + Math.PI * 2
            setTrailRotations([]) // Clear trails
        }
    }, [isRotating])
    
    useFrame((_, delta) => {
        // Handle rotation around y-axis for shell method
        if (isRotating && groupRef.current) {
            const oldRotation = groupRef.current.rotation.y
            groupRef.current.rotation.y += delta * SHELL_ROTATION_SPEED
            
            // Add trail every 15 degrees
            const rotationStep = Math.PI / SHELL_TRAIL_COUNT
            if (Math.floor(groupRef.current.rotation.y / rotationStep) > 
                Math.floor(oldRotation / rotationStep)) {
                
                setTrailRotations(prev => {
                    const newTrails = [oldRotation, ...prev]
                    return newTrails.slice(0, SHELL_TRAIL_COUNT) // Keep only recent trails
                })
            }
            
            // When rotation completes
            if (groupRef.current.rotation.y >= targetRotation.current) {
                groupRef.current.rotation.y = targetRotation.current
                setTrailRotations([])  // Clear trails
                setShowSurface(true)   // Show surface
                onRotationComplete()   // Notify parent
            }
        }

        // Handle shell animation with volume calculation
        if (showShells && !isComplete) {
            const currentPhase = SHELL_PHASES[phase]
            const shells: ShellData[] = []
            
            try {
                for (let x = minBound; x <= maxBound; x += currentPhase.stepSize) {
                    const height = Math.abs(evalFn3D(userFn, x))
                    shells.push({
                        position: [0, height / 2, 0] as [number, number, number],
                        rotation: [0, 0, 0] as [number, number, number],
                        radius: x,
                        height: height,
                        thickness: currentPhase.stepSize
                    })
                }
                
                // Calculate current volume
                if (shells.length > 0) {
                    // const currentX = minBound + ((maxBound - minBound) * visibleShells) / shells.length
                    // setCurrentVolume(calculatePartialShellVolume(userFn, minBound, currentX, currentPhase.stepSize))
                }
            } catch (e) {
                // Handle function evaluation errors
            }

            if (visibleShells < shells.length) {
                setVisibleShells(prev => prev + currentPhase.speed)
            } else if (phase < SHELL_PHASES.length - 1) {
                setVisibleShells(0)
                setPhase(prev => prev + 1)
            } else {
                setIsComplete(true)
            }
        }
    })

    // Generate shells for current phase
    const shells = React.useMemo(() => {
        if (!showShells) return []
        
        const arr: ShellData[] = []
        const stepSize = SHELL_PHASES[phase]?.stepSize || 0.1
        
        try {
            for (let x = minBound; x <= maxBound; x += stepSize) {
                const height = Math.abs(evalFn3D(userFn, x))
                arr.push({
                    position: [0, height / 2, 0] as [number, number, number],
                    rotation: [0, 0, 0] as [number, number, number],
                    radius: x,
                    height: height,
                    thickness: stepSize
                })
            }
            return arr
        } catch (e) { return [] }
    }, [userFn, minBound, maxBound, phase, showShells])

    return (
        <>
            {/* Trail copies - each trail is a copy of all children */}
            {trailRotations.map((rotation, i) => (
                <group key={`trail-${i}`} rotation={[0, rotation, 0]}>
                    <Line 
                        points={generateFunctionPoints(userFn, minBound, maxBound)}
                        color="yellow"
                        lineWidth={2}
                        transparent={true}
                        opacity={0.8}
                    />
                    <ShellBoundaries 
                        userFn={userFn}
                        lowerBound={minBound}
                        upperBound={maxBound}
                    />
                </group>
            ))}
            
            {/* Current rotating function */}
            <group ref={groupRef}>
                <Line 
                    points={generateFunctionPoints(userFn, minBound, maxBound)}
                    color="yellow"
                    lineWidth={2}
                    transparent={true}
                    opacity={0.8}
                />
                <ShellBoundaries 
                    userFn={userFn}
                    lowerBound={minBound}
                    upperBound={maxBound}
                />
            </group>

            {/* Specialized Shell Surface */}
            <ShellSurface
                userFn={userFn}
                lowerBound={minBound}
                upperBound={maxBound}
                active={showSurface}
            />

            {/* Shell Animation */}
            {showShells && (
                <group>
                    {shells.slice(0, Math.floor(visibleShells)).map((shell, i) => (
                        <React.Fragment key={i}>
                            {/* Outer shell wall */}
                            <Cylinder
                                position={shell.position}
                                rotation={shell.rotation}
                                args={[shell.radius + shell.thickness/2, shell.radius + shell.thickness/2, shell.height, 32, 1, true]}
                            >
                                <meshPhysicalMaterial
                                    color="black"
                                    metalness={0.7}
                                    roughness={0.4}
                                    opacity={0.8}
                                    transparent={true}
                                />
                            </Cylinder>

                            {/* Inner shell wall (hollow effect) */}
                            <Cylinder
                                position={shell.position}
                                rotation={shell.rotation}
                                args={[shell.radius - shell.thickness/2, shell.radius - shell.thickness/2, shell.height, 32, 1, true]}
                            >
                                <meshStandardMaterial
                                    color="#FFD700"
                                    metalness={0}
                                    roughness={0.5}
                                    transparent={true}
                                    opacity={0.6}
                                />
                            </Cylinder>
                        </React.Fragment>
                    ))}
                </group>
            )}
        </>
    )
}

export default ShellMethod 