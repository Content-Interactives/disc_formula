import React from 'react'
import { Vector2 } from 'three'
import { evaluate } from 'mathjs'
import * as THREE from 'three'

interface ShellSurfaceProps {
    userFn: string
    lowerBound: number
    upperBound: number
    active: boolean
}

const ShellSurface: React.FC<ShellSurfaceProps> = ({ userFn, lowerBound, upperBound, active }) => {
    if (!active) return null
    
    const points: Vector2[] = []
    const steps = 50  // Resolution for smooth surface
    
    try {
        // For shell method: we rotate the function curve around the y-axis
        // The profile should just be the function curve y = f(x)
        // When rotated around y-axis, this creates the surface of revolution
        
        // Add bottom edge along x-axis first (from lowerBound to upperBound)
        for (let i = 0; i <= steps; i++) {
            const x = lowerBound + ((upperBound - lowerBound) * i) / steps
            points.push(new Vector2(x, 0)) // Bottom edge at y = 0
        }
        
        // Add top edge along the function curve (from upperBound back to lowerBound)
        for (let i = steps; i >= 0; i--) {
            const x = lowerBound + ((upperBound - lowerBound) * i) / steps
            const y = Math.abs(evaluate(userFn, { x }))
            points.push(new Vector2(x, y)) // Function curve
        }
        
    } catch (e) {
        console.warn('Error generating shell surface:', e)
        return null
    }

    return (
        <mesh>
            <latheGeometry args={[points, 32]} />
            <meshPhysicalMaterial 
                color="#9370DB"
                transparent={true}
                opacity={0.3}
                side={THREE.DoubleSide}
                roughness={0.1}
                metalness={0.1}
            />
        </mesh>
    )
}

export default ShellSurface 