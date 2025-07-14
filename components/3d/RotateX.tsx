import React, { useRef, useEffect, useState, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Group } from 'three'

interface RotateXProps {
    isRotating: boolean
    onComplete?: () => void
    maxTrails?: number
    children: React.ReactElement | React.ReactElement[]  // This is what we render and rotate
}

const RotateX: React.FC<RotateXProps> = ({ 
    isRotating, 
    onComplete, 
    maxTrails = 10000,
    children,
}) => {
    const groupRef = useRef<Group>(null)
    const targetRotation = useRef(0)
    const [trailRotations, setTrailRotations] = useState<number[]>([])
    
    useEffect(() => {
        if (isRotating && groupRef.current) {
            targetRotation.current = groupRef.current.rotation.x + Math.PI * 2
            setTrailRotations([]) // Clear trails
        }
    }, [isRotating])
    
    useFrame((_, delta) => {
        if (isRotating && groupRef.current) {
            const oldRotation = groupRef.current.rotation.x
            groupRef.current.rotation.x += delta * 2
            
            // Add trail every 15 degrees, keep only maxTrails
            const rotationStep = Math.PI / 720
            if (Math.floor(groupRef.current.rotation.x / rotationStep) > 
                Math.floor(oldRotation / rotationStep)) {
                
                setTrailRotations(prev => {
                    const newTrails = [oldRotation, ...prev]
                    return newTrails.slice(0, maxTrails) // Keep only recent trails
                })
            }
            
            // Stop after 360°
            if (groupRef.current.rotation.x >= targetRotation.current) {
                groupRef.current.rotation.x = targetRotation.current
                if (onComplete) onComplete()
            }
        }
    })

    // Remove the FunctionCurve component entirely
    
    return (
        <>
            {/* Trail copies - each trail is a copy of all children */}
            {trailRotations.map((rotation, index) => (
                <group key={`trail-${rotation}`} rotation={[rotation, 0, 0]}>
                    {children}  {/* Whatever was passed from Plot3D */}
                </group>
            ))}
            
            {/* Current rotating function - the main children */}
            <group ref={groupRef}>
                {children}  {/* Whatever was passed from Plot3D */}
            </group>
        </>
    )
}

export default RotateX
