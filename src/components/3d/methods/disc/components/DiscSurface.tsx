import React from 'react'
import { Vector2 } from 'three'
import { evaluate } from 'mathjs'
import * as THREE from 'three'

interface DiscSurfaceProps {
    userFn: string
    lowerBound: number
    upperBound: number
    active: boolean
}

const DiscSurface: React.FC<DiscSurfaceProps> = ({ userFn, lowerBound, upperBound, active }) => {
    if (!active) return null
    
    const points: Vector2[] = []
    const steps = 100  // Higher resolution for smooth surface
    
    try {
        for (let i = 0; i <= steps; i++) {
            const x = lowerBound + ((upperBound - lowerBound) * i) / steps
            const y = Math.abs(evaluate(userFn, { x }))
            
            // For disc method: radius = f(x), height = x
            points.push(new Vector2(y, -x)) // (radius, -height to flip orientation)
        }
    } catch (e) {
        console.warn('Error generating disc surface:', e)
        return null
    }

    return (
        <mesh rotation={[0, 0, Math.PI / 2]}>
            <latheGeometry args={[points, 32]} />
            <meshPhongMaterial 
                color="#E0F2F1"
                transparent={true}
                opacity={0.3}
                side={THREE.DoubleSide}
                shininess={100}
            />
        </mesh>
    )
}

export default DiscSurface 