import React, { useState, useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Group } from 'three'
import type { WasherMethodProps } from './types'
import { WASHER_ROTATION_SPEED, WASHER_TRAIL_COUNT, WASHER_COLORS } from './config'
import WasherSurface from './components/WasherSurface'
import WasherTrails from './components/WasherTrails'
import WasherFunctions from './components/WasherFunctions'
import HollowWasher from './components/HollowWasher'
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
    const groupRef = useRef<Group>(null)
    const targetRotation = useRef(0)
    
    const outerFn = userFunctions[0] || "2*x"
    const innerFn = userFunctions[1] || "x"
    
    const { washers, visibleWashers, currentVolume, updateAnimation } = useWasherAnimation(
        outerFn, innerFn, lowerBound, upperBound, showWashers
    )

    useEffect(() => {
        if (isRotating && groupRef.current) {
            targetRotation.current = groupRef.current.rotation.x + Math.PI * 2
            setTrailRotations([])
        }
    }, [isRotating])
    
    useFrame((_, delta) => {
        // Handle rotation
        if (isRotating && groupRef.current) {
            const oldRotation = groupRef.current.rotation.x
            groupRef.current.rotation.x += delta * WASHER_ROTATION_SPEED
            
            const rotationStep = Math.PI / (WASHER_TRAIL_COUNT / 2)
            if (Math.floor(groupRef.current.rotation.x / rotationStep) > 
                Math.floor(oldRotation / rotationStep)) {
                
                setTrailRotations(prev => [oldRotation, ...prev].slice(0, Math.floor(WASHER_TRAIL_COUNT / 2)))
            }
            
            if (groupRef.current.rotation.x >= targetRotation.current) {
                groupRef.current.rotation.x = targetRotation.current
                setTrailRotations([])
                setShowSurface(true)
                onRotationComplete()
            }
        }

        updateAnimation()
    })

    return (
        <>
            <WasherTrails 
                trailRotations={trailRotations}
                outerFn={outerFn}
                innerFn={innerFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
            />
            
            <WasherFunctions
                outerFn={outerFn}
                innerFn={innerFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
                groupRef={groupRef}
            />

            <WasherSurface
                outerFn={outerFn}
                innerFn={innerFn}
                lowerBound={lowerBound}
                upperBound={upperBound}
                active={showSurface}
            />
            
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