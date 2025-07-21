import React, { useState, useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Group } from 'three'
import type { WasherMethodProps } from './types'
import { WASHER_ROTATION_SPEED, WASHER_TRAIL_COUNT } from './config'
import WasherTracing from './components/rotation/WasherTracing'
import WasherVolumeShell from './components/volume-shell/WasherVolumeShell'
import WasherAnimation from './components/washer-animation/WasherAnimation'
import { useWasherAnimation } from './hooks/useWasherAnimation'

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
    
    // Get both functions for washer method
    const outerFn = userFunctions[0] || "2*x"  // R(x) - outer function
    const innerFn = userFunctions[1] || "x"    // r(x) - inner function

    // Use washer animation hook
    const { washers, visibleWashers, currentVolume } = useWasherAnimation({
        outerFn,
        innerFn,
        lowerBound,
        upperBound,
        showWashers
    })

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
            
            // Add trail every rotation step
            const rotationStep = Math.PI / WASHER_TRAIL_COUNT
            if (Math.floor(groupRef.current.rotation.x / rotationStep) > 
                Math.floor(oldRotation / rotationStep)) {
                
                setTrailRotations(prev => {
                    const newTrails = [oldRotation, ...prev]
                    return newTrails.slice(0, WASHER_TRAIL_COUNT) // Keep only recent trails
                })
            }

            if (groupRef.current.rotation.x >= targetRotation.current) {
                groupRef.current.rotation.x = targetRotation.current
                setTrailRotations([])
                setShowSurface(true)
                onRotationComplete()
            }
        }
    })

    return (
        <>
            <WasherTracing
                outerFn={outerFn}
                innerFn={innerFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
                trailRotations={trailRotations}
                groupRef={groupRef}
            />

            <WasherVolumeShell
                outerFn={outerFn}
                innerFn={innerFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
                active={showSurface}
            />

            <WasherAnimation
                washers={washers}
                visibleWashers={visibleWashers}
                showWashers={showWashers}
            />
        </>
    )
}

export default WasherMethod 