import React from 'react'
import { Vector2 } from 'three'
import { evaluate } from 'mathjs'
import * as THREE from 'three'

interface WasherSurfaceProps {
    outerFn: string
    innerFn: string
    lowerBound: number
    upperBound: number
    active: boolean
}

const WasherSurface: React.FC<WasherSurfaceProps> = ({ 
    outerFn, 
    innerFn, 
    lowerBound, 
    upperBound, 
    active 
}) => {
    if (!active) return null
    
    const steps = 50

    // Generate points for outer surface
    const outerPoints = React.useMemo(() => {
        const points: Vector2[] = []
        try {
            for (let i = 0; i <= steps; i++) {
                const x = lowerBound + ((upperBound - lowerBound) * i) / steps
                const y = Math.abs(evaluate(outerFn, { x }))
                points.push(new Vector2(y, -x))
            }
        } catch (e) {
            console.warn('Error generating outer points:', e)
        }
        return points
    }, [outerFn, lowerBound, upperBound])

    // Generate points for inner surface
    const innerPoints = React.useMemo(() => {
        const points: Vector2[] = []
        try {
            for (let i = 0; i <= steps; i++) {
                const x = lowerBound + ((upperBound - lowerBound) * i) / steps
                const y = Math.abs(evaluate(innerFn, { x }))
                points.push(new Vector2(y, -x))
            }
        } catch (e) {
            console.warn('Error generating inner points:', e)
        }
        return points
    }, [innerFn, lowerBound, upperBound])

    return (
        <group>
            {/* Outer surface - more translucent */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <latheGeometry args={[outerPoints, 32]} />
                <meshPhongMaterial 
                    color="#E0F2F1"
                    transparent={true}
                    opacity={0.2} // Slightly more visible outer surface
                    side={THREE.DoubleSide} // Double-sided rendering
                    shininess={100}
                    depthWrite={false} // Prevent depth conflicts
                />
            </mesh>

            {/* Inner surface - more visible */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <latheGeometry args={[innerPoints, 32]} />
                <meshPhongMaterial 
                    color="#E0F2F1"
                    transparent={true}
                    opacity={0.4} // More visible inner surface
                    side={THREE.DoubleSide} // Double-sided rendering
                    shininess={100}
                    depthWrite={false} // Prevent depth conflicts
                />
            </mesh>

            {/* End cap at lower bound (x = a) - on yz plane */}
            {React.useMemo(() => {
                try {
                    const outerRadius = Math.abs(evaluate(outerFn, { x: lowerBound }))
                    const innerRadius = Math.abs(evaluate(innerFn, { x: lowerBound }))
                    
                    if (outerRadius > innerRadius) {
                        return (
                            <group>
                                {/* Outer disc */}
                                <mesh position={[lowerBound, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                                    <circleGeometry args={[outerRadius, 32]} />
                                    <meshPhongMaterial 
                                        color="#E0F2F1"
                                        transparent={true}
                                        opacity={0.3}
                                        side={THREE.DoubleSide}
                                        shininess={100}
                                    />
                                </mesh>
                                {/* Inner hole - cut out */}
                                <mesh position={[lowerBound, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                                    <circleGeometry args={[innerRadius, 32]} />
                                    <meshPhongMaterial 
                                        color="#000000"
                                        transparent={true}
                                        opacity={0}
                                        side={THREE.DoubleSide}
                                    />
                                </mesh>
                            </group>
                        )
                    }
                } catch (e) {
                    console.warn('Error creating lower bound cap:', e)
                }
                return null
            }, [outerFn, innerFn, lowerBound])}

            {/* End cap at upper bound (x = b) - on yz plane */}
            {React.useMemo(() => {
                try {
                    const outerRadius = Math.abs(evaluate(outerFn, { x: upperBound }))
                    const innerRadius = Math.abs(evaluate(innerFn, { x: upperBound }))
                    
                    if (outerRadius > innerRadius) {
                        return (
                            <group>
                                {/* Outer disc */}
                                <mesh position={[upperBound, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                                    <circleGeometry args={[outerRadius, 32]} />
                                    <meshPhongMaterial 
                                        color="#E0F2F1"
                                        transparent={true}
                                        opacity={0.3}
                                        side={THREE.DoubleSide}
                                        shininess={100}
                                    />
                                </mesh>
                                {/* Inner hole - cut out */}
                                <mesh position={[upperBound, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                                    <circleGeometry args={[innerRadius, 32]} />
                                    <meshPhongMaterial 
                                        color="#000000"
                                        transparent={true}
                                        opacity={0}
                                        side={THREE.DoubleSide}
                                    />
                                </mesh>
                            </group>
                        )
                    }
                } catch (e) {
                    console.warn('Error creating upper bound cap:', e)
                }
                return null
            }, [outerFn, innerFn, upperBound])}
        </group>
    )
}

export default WasherSurface 