import React, { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Group } from 'three'

interface RotateXProps {
    isRotating: boolean
    children: React.ReactNode
    onComplete?: () => void
}

const RotateX: React.FC<RotateXProps> = ({ isRotating, children, onComplete }) => {
    const groupRef = useRef<Group>(null)
    const targetRotation = useRef(0)
    
    useEffect(() => {
        if (isRotating && groupRef.current) {
            targetRotation.current = groupRef.current.rotation.x + Math.PI * 2  // Add 360°
        }
    }, [isRotating])
    
    useFrame((_, delta) => {
        if (isRotating && groupRef.current) {
            groupRef.current.rotation.x += delta * 2
            
            // Stop after 360°
            if (groupRef.current.rotation.x >= targetRotation.current) {
                groupRef.current.rotation.x = targetRotation.current
                if (onComplete) onComplete()
            }
        }
    })
    
    return <group ref={groupRef}>{children}</group>
}

export default RotateX
