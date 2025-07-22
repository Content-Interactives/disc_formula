import React from 'react'
import * as THREE from 'three'

interface HollowWasherProps {
    position: [number, number, number]
    rotation: [number, number, number] 
    outerRadius: number
    innerRadius: number
    height: number
}

const HollowWasher: React.FC<HollowWasherProps> = ({
    position,
    rotation,
    outerRadius,
    innerRadius,
    height
}) => {
    return (
        <group position={position} rotation={rotation}>
            {/* Top ring face - donut shaped top */}
            <mesh position={[0, height / 2, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <ringGeometry args={[innerRadius, outerRadius, 32]} />
                <meshPhysicalMaterial
                    color="#C0C0C0"
                    metalness={0.8}
                    roughness={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>
            
            {/* Bottom ring face - donut shaped bottom */}
            <mesh position={[0, -height / 2, 0]} rotation={[Math.PI/2, 0, 0]}>
                <ringGeometry args={[innerRadius, outerRadius, 32]} />
                <meshPhysicalMaterial
                    color="#C0C0C0"
                    metalness={0.8}
                    roughness={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>
            
            {/* Outer wall - the outside of the washer */}
            <mesh>
                <cylinderGeometry args={[outerRadius, outerRadius, height, 32, 1, true]} />
                <meshPhysicalMaterial
                    color="#C0C0C0"
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
            
            {/* Inner wall - the hole wall (visible inside) */}
            <mesh>
                <cylinderGeometry args={[innerRadius, innerRadius, height, 24, 1, true]} />
                <meshPhysicalMaterial
                    color="#A0A0A0"
                    metalness={0.6}
                    roughness={0.4}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    )
}

export default HollowWasher
