import React from 'react'
import * as THREE from 'three'
import { Cylinder } from '@react-three/drei'

interface ShellProps {
    position: [number, number, number]
    rotation: [number, number, number]
    radius: number
    height: number
    thickness: number
    opacity?: number
}

const Shell: React.FC<ShellProps> = ({
    position,
    rotation,
    radius,
    height,
    thickness,
    opacity = 0.8
}) => {
    // Don't render if radius is too small
    if (radius <= 0.01 || height <= 0) return null

    return (
        <group position={position} rotation={rotation}>
            {/* Main cylindrical shell - shiny metallic silver, positioned at y=height/2 to sit on x-axis */}
            <Cylinder args={[radius, radius, height, 32, 1, true]} position={[0, height/2, 0]}>
                <meshPhysicalMaterial
                    color="#E8E8E8" // Bright shiny silver
                    transparent={false}
                    metalness={0.95} // Very metallic
                    roughness={0.05} // Very smooth and shiny
                    side={THREE.DoubleSide}
                />
            </Cylinder>

            {/* Shell thickness visualization - outer edge */}
            <Cylinder args={[radius + thickness/2, radius + thickness/2, height, 32, 1, true]} position={[0, height/2, 0]}>
                <meshPhysicalMaterial
                    color="#D0D0D0" // Slightly darker silver for depth
                    transparent={true}
                    opacity={0.2}
                    metalness={0.9}
                    roughness={0.1}
                    side={THREE.DoubleSide}
                />
            </Cylinder>

            {/* Shell thickness visualization - inner edge */}
            <Cylinder args={[radius - thickness/2, radius - thickness/2, height, 32, 1, true]} position={[0, height/2, 0]}>
                <meshPhysicalMaterial
                    color="#F5F5F5" // Very bright silver highlight
                    transparent={true}
                    opacity={0.1}
                    metalness={1.0}
                    roughness={0.0}
                    side={THREE.DoubleSide}
                />
            </Cylinder>

            {/* Top rim - bright silver edge */}
            <Cylinder args={[radius + thickness/2, radius - thickness/2, thickness/4, 32]} position={[0, height - thickness/8, 0]}>
                <meshPhysicalMaterial
                    color="#F8F8F8" // Very bright silver
                    transparent={false}
                    metalness={1.0}
                    roughness={0.0}
                />
            </Cylinder>

            {/* Bottom rim - bright silver edge */}
            <Cylinder args={[radius + thickness/2, radius - thickness/2, thickness/4, 32]} position={[0, thickness/8, 0]}>
                <meshPhysicalMaterial
                    color="#F8F8F8" // Very bright silver
                    transparent={false}
                    metalness={1.0}
                    roughness={0.0}
                />
            </Cylinder>
        </group>
    )
}

export default Shell 