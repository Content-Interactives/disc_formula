import React from 'react'
import { Vector2 } from 'three'
import { evaluate } from 'mathjs'
import * as THREE from 'three'

interface WasherVolumeShellProps {
    outerFn: string
    innerFn: string
    lowerBound: number
    upperBound: number
    active: boolean
}

const WasherVolumeShell: React.FC<WasherVolumeShellProps> = ({ 
    outerFn, 
    innerFn, 
    lowerBound, 
    upperBound, 
    active 
}) => {
    if (!active) return null

    // Generate washer profile points (creates hollow shape)
    const generateWasherProfile = () => {
        const points: Vector2[] = []
        const steps = 50

        try {
            // Create the washer profile by going around the hollow shape
            // Start from lower bound - trace outer surface
            for (let i = 0; i <= steps; i++) {
                const x = lowerBound + ((upperBound - lowerBound) * i) / steps
                const outerValue = Math.abs(evaluate(outerFn, { x }))
                const innerValue = Math.abs(evaluate(innerFn, { x }))
                
                // Add outer surface point (larger radius)
                const outerRadius = Math.max(outerValue, innerValue)
                points.push(new Vector2(outerRadius, x))
            }
            
            // Connect back along inner surface (reverse direction)
            for (let i = steps; i >= 0; i--) {
                const x = lowerBound + ((upperBound - lowerBound) * i) / steps
                const outerValue = Math.abs(evaluate(outerFn, { x }))
                const innerValue = Math.abs(evaluate(innerFn, { x }))
                
                // Add inner surface point (smaller radius)
                const innerRadius = Math.min(outerValue, innerValue)
                points.push(new Vector2(innerRadius, x))
            }
            
            return points
        } catch (e) {
            console.warn('Error generating washer profile:', e)
            return []
        }
    }

    const washerPoints = generateWasherProfile()
    
    if (washerPoints.length === 0) return null

    return (
        <group rotation={[0, 0, -Math.PI/2]}>
            <mesh>
                <latheGeometry args={[washerPoints, 32]} />
                <meshPhysicalMaterial 
                    color="#4ECDC4"
                    transparent={true}
                    opacity={0.3}
                    side={THREE.DoubleSide}
                    roughness={0.1}
                    metalness={0.1}
                />
            </mesh>
        </group>
    )
}

export default WasherVolumeShell 