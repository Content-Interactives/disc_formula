import React from 'react'
import { Cylinder } from '@react-three/drei'
import { WASHER_COLORS } from '../config'

interface HollowWasherProps {
    position: [number, number, number]
    rotation: [number, number, number]
    outerRadius: number
    innerRadius: number
    height: number
    opacity?: number
}

const HollowWasher: React.FC<HollowWasherProps> = ({
    position,
    rotation,
    outerRadius,
    innerRadius,
    height,
    opacity = 0.8
}) => {
    // Only render if we have a valid washer (outer > inner)
    if (outerRadius <= innerRadius) return null

    return (
        <group position={position} rotation={rotation}>
            {/* Main washer body - outer cylinder */}
            <Cylinder
                args={[outerRadius, outerRadius, height, 16]}
            >
                <meshPhysicalMaterial
                    color={WASHER_COLORS.outer}
                    metalness={0.3}
                    roughness={0.6}
                    opacity={opacity * 0.7}
                    transparent={true}
                />
            </Cylinder>

            {/* Inner hole - black cylinder to create hollow effect */}
            <Cylinder
                args={[innerRadius, innerRadius, height * 1.01, 16]}
            >
                <meshBasicMaterial
                    color="#000000"
                    transparent={true}
                    opacity={0.9}
                />
            </Cylinder>

            {/* Top ring to show washer edge */}
            <mesh position={[0, height * 0.5, 0]}>
                <ringGeometry args={[innerRadius, outerRadius, 16]} />
                <meshStandardMaterial
                    color="#FFD700"
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>

            {/* Bottom ring to show washer edge */}
            <mesh position={[0, -height * 0.5, 0]}>
                <ringGeometry args={[innerRadius, outerRadius, 16]} />
                <meshStandardMaterial
                    color="#FFD700"
                    metalness={0.5}
                    roughness={0.3}
                />
            </mesh>
        </group>
    )
}

export default HollowWasher 