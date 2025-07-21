import React, { useState, useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import { Group } from 'three'
import { generateFunctionPoints } from '../../../utils/mathUtils'
import type { ShellMethodProps } from './types'
import { SHELL_COLORS, SHELL_ROTATION_SPEED, SHELL_TRAIL_COUNT } from './config'
import ShellSurface from './components/ShellSurface'
import ShellBoundaries from './components/ShellBoundaries'
import Shell from './components/Shell'
import { useShellAnimation } from './hooks/useShellAnimation'

const ShellMethod: React.FC<ShellMethodProps> = ({
    userFunctions,
    lowerBound,
    upperBound,
    isRotating,
    showShells,
    onRotationComplete
}) => {
    const [showSurface, setShowSurface] = useState(false)
    const [trailRotations, setTrailRotations] = useState<number[]>([])
    const groupRef = useRef<Group>(null)
    const targetRotation = useRef(0)
    
    const userFn = userFunctions[0] || "x" // Get first function for shell method
    
    const { shells, visibleShells, currentVolume, updateAnimation } = useShellAnimation(
        userFn, lowerBound, upperBound, showShells
    )

    useEffect(() => {
        if (isRotating && groupRef.current) {
            targetRotation.current = groupRef.current.rotation.y + Math.PI * 2 // Rotate around Y-axis for shell method
            setTrailRotations([])
        }
    }, [isRotating])

    useFrame((_, delta) => {
        if (isRotating && groupRef.current) {
            const rotationSpeed = SHELL_ROTATION_SPEED * delta
            groupRef.current.rotation.y += rotationSpeed

            // Create trail copies during rotation
            if (Math.random() < 0.1) {
                setTrailRotations(prev => {
                    const newTrails = [...prev, groupRef.current!.rotation.y]
                    return newTrails.slice(-SHELL_TRAIL_COUNT)
                })
            }

            // Check rotation completion
            if (groupRef.current.rotation.y >= targetRotation.current) {
                groupRef.current.rotation.y = targetRotation.current
                setTrailRotations([])
                setShowSurface(true) // Show surface after rotation completes
                onRotationComplete()
            }
        }
        updateAnimation()
    })

    return (
        <>
            {/* Trail copies - each trail is a copy of the function */}
            {trailRotations.map((rotation, i) => (
                <group key={`trail-${i}`} rotation={[0, rotation, 0]}>
                    <Line 
                        points={generateFunctionPoints(userFn, lowerBound, upperBound, 20)}
                        color={SHELL_COLORS.function}
                        lineWidth={2}
                        transparent={true}
                        opacity={0.5}
                    />
                    <ShellBoundaries 
                        userFn={userFn}
                        lowerBound={lowerBound}
                        upperBound={upperBound}
                    />
                </group>
            ))}
            
            {/* Current rotating function */}
            <group ref={groupRef}>
                <Line 
                    points={generateFunctionPoints(userFn, lowerBound, upperBound, 30)}
                    color={SHELL_COLORS.function}
                    lineWidth={3}
                    transparent={true}
                    opacity={1.0}
                />
                <ShellBoundaries 
                    userFn={userFn}
                    lowerBound={lowerBound}
                    upperBound={upperBound}
                />
            </group>

            {/* Volume surface - shown after rotation completes */}
            <ShellSurface
                userFn={userFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
                active={showSurface}
            />
            
            {/* Multi-phase shell animation - shiny silver shells */}
            {showShells && (
                <group>
                    {shells.slice(0, Math.floor(visibleShells)).map((shell, i) => (
                        <Shell
                            key={i}
                            position={shell.position}
                            rotation={shell.rotation}
                            radius={shell.radius}
                            height={shell.height}
                            thickness={shell.thickness}
                            opacity={0.8}
                        />
                    ))}
                </group>
            )}
        </>
    )
}

export default ShellMethod 