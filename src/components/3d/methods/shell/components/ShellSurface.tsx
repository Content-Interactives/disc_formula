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
    const steps = 100  // Higher resolution for smooth surface
    
    try {
        for (let i = 0; i <= steps; i++) {
            const x = lowerBound + ((upperBound - lowerBound) * i) / steps
            const y = Math.abs(evaluate(userFn, { x }))
            
            // For shell method: rotating around y-axis
            // x becomes radius, y stays as height
            points.push(new Vector2(x, y))
        }
    } catch (e) {
        console.warn('Error generating shell surface:', e)
        return null
    }

    return (
        <mesh>
            <latheGeometry args={[points, 32]} />
            <meshPhongMaterial 
                color="#E8F5E8"
                transparent={true}
                opacity={0.3}
                side={THREE.DoubleSide}
                shininess={100}
            />
        </mesh>
    )
}

export default ShellSurface 