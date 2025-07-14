import React, { useMemo } from "react"
import { evaluate } from 'mathjs'
import * as THREE from 'three'

interface DiscSurfaceProps {
    func: string
    a: number
    b: number
    rotationProgress: number  // 0 to 1 (0% to 100% of rotation)
    showSurface?: boolean
}

const DiscSurface: React.FC<DiscSurfaceProps> = ({ 
    func, 
    a, 
    b, 
    rotationProgress, 
    showSurface = true 
}) => {
    const latheGeometry = useMemo(() => {
        if (!showSurface || rotationProgress <= 0) return null
        
        const lower = Math.min(a, b)
        const upper = Math.max(a, b)
        const stepSize = 0.1
        const numSteps = Math.floor((upper - lower) / stepSize)
        
        if (numSteps <= 0) return null
        
        // Generate 2D curve points for the lathe
        const curvePoints: THREE.Vector2[] = []
        
        for (let i = 0; i <= numSteps; i++) {
            const x = lower + i * stepSize
            
            try {
                const y = evaluate(func, { x }) as number
                const radius = Math.abs(y * y) // Squared for disc method
                
                // LatheGeometry expects Vector2 points (x = distance from axis, y = height along axis)
                // For rotation around x-axis: x-coord becomes the height, y-coord becomes radius
                curvePoints.push(new THREE.Vector2(radius, x))
            } catch (e) {
                // Fallback for invalid function
                const radius = Math.abs(x * x * x * x)
                curvePoints.push(new THREE.Vector2(radius, x))
            }
        }
        
        if (curvePoints.length < 2) return null
        
        // Number of segments based on rotation progress (2 to 32 segments)
        const maxSegments = 32
        const currentSegments = Math.max(2, Math.floor(rotationProgress * maxSegments))
        
        // Create LatheGeometry - automatically handles surface of revolution
        const geometry = new THREE.LatheGeometry(
            curvePoints,
            currentSegments,
            0,                                    // Start angle
            rotationProgress * Math.PI * 2       // End angle (progress * 360°)
        )
        
        return geometry
    }, [func, a, b, rotationProgress, showSurface])
    
    if (!latheGeometry) return null
    
    return (
        <mesh geometry={latheGeometry}>
            <meshStandardMaterial 
                color="#4CAF50" 
                transparent 
                opacity={0.6}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}

export default DiscSurface
