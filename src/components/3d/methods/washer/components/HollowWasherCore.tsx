import React from 'react'
import { evaluate } from 'mathjs'
import * as THREE from 'three'

interface HollowWasherCoreProps {
    outerFn: string
    innerFn: string
    lowerBound: number
    upperBound: number
    active: boolean
    opacity?: number
}

const HollowWasherCore: React.FC<HollowWasherCoreProps> = ({
    outerFn,
    innerFn,
    lowerBound,
    upperBound,
    active,
    opacity = 0.15
}) => {
    if (!active) return null

    // Create cross-sectional rings at key positions to show hollow structure
    const crossSectionRings = React.useMemo(() => {
        const rings = []
        const numRings = 8
        
        for (let i = 0; i <= numRings; i++) {
            const t = i / numRings
            const x = lowerBound + t * (upperBound - lowerBound)
            
            try {
                const outerRadius = Math.abs(evaluate(outerFn, { x }))
                const innerRadius = Math.abs(evaluate(innerFn, { x }))
                
                if (outerRadius > innerRadius) {
                    rings.push({
                        position: [x, 0, 0] as [number, number, number],
                        outerRadius,
                        innerRadius,
                        key: `cross-ring-${i}`
                    })
                }
            } catch (e) {
                // Skip invalid positions
            }
        }
        
        return rings
    }, [outerFn, innerFn, lowerBound, upperBound])

    // Create wireframe lines to show the hollow structure
    const hollowWireframe = React.useMemo(() => {
        const lines = []
        const radialLines = 8 // Number of radial lines
        
        for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / radialLines) {
            const outerPoints: [number, number, number][] = []
            const innerPoints: [number, number, number][] = []
            
            try {
                for (let i = 0; i <= 20; i++) {
                    const t = i / 20
                    const x = lowerBound + t * (upperBound - lowerBound)
                    
                    const outerRadius = Math.abs(evaluate(outerFn, { x }))
                    const innerRadius = Math.abs(evaluate(innerFn, { x }))
                    
                    if (outerRadius > innerRadius) {
                        const cos = Math.cos(angle)
                        const sin = Math.sin(angle)
                        
                        outerPoints.push([x, outerRadius * cos, outerRadius * sin])
                        innerPoints.push([x, innerRadius * cos, innerRadius * sin])
                    }
                }
                
                if (outerPoints.length > 1) {
                    lines.push({
                        points: outerPoints,
                        key: `outer-line-${angle}`,
                        color: '#E0F2F1'
                    })
                    lines.push({
                        points: innerPoints,
                        key: `inner-line-${angle}`,
                        color: '#B0BEC5'
                    })
                }
            } catch (e) {
                // Skip invalid lines
            }
        }
        
        return lines
    }, [outerFn, innerFn, lowerBound, upperBound])

    return (
        <group>
            {/* Cross-sectional rings to show hollow structure */}
            {crossSectionRings.map((ring) => (
                <mesh 
                    key={ring.key} 
                    position={ring.position} 
                    rotation={[Math.PI/2, 0, 0]}
                >
                    <ringGeometry args={[ring.innerRadius, ring.outerRadius, 16]} />
                    <meshBasicMaterial 
                        color="#CFD8DC"
                        transparent={true}
                        opacity={opacity}
                        side={THREE.DoubleSide}
                        wireframe={false}
                    />
                </mesh>
            ))}

            {/* Wireframe rings for the hollow outline */}
            {crossSectionRings.map((ring) => (
                <group key={`wireframe-${ring.key}`}>
                    {/* Outer ring wireframe */}
                    <mesh 
                        position={ring.position} 
                        rotation={[Math.PI/2, 0, 0]}
                    >
                        <ringGeometry args={[ring.outerRadius * 0.98, ring.outerRadius, 12]} />
                        <meshBasicMaterial 
                            color="#E0F2F1"
                            transparent={true}
                            opacity={opacity * 2}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                    
                    {/* Inner ring wireframe */}
                    <mesh 
                        position={ring.position} 
                        rotation={[Math.PI/2, 0, 0]}
                    >
                        <ringGeometry args={[ring.innerRadius, ring.innerRadius * 1.02, 12]} />
                        <meshBasicMaterial 
                            color="#90A4AE"
                            transparent={true}
                            opacity={opacity * 2}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                </group>
            ))}

            {/* Inner cavity indicator - dark cylinder to show the hollow space */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[
                    Math.min(...crossSectionRings.map(r => r.innerRadius)), 
                    Math.min(...crossSectionRings.map(r => r.innerRadius)), 
                    upperBound - lowerBound, 
                    16
                ]} />
                <meshBasicMaterial 
                    color="#263238"
                    transparent={true}
                    opacity={0.1}
                />
            </mesh>
        </group>
    )
}

export default HollowWasherCore 