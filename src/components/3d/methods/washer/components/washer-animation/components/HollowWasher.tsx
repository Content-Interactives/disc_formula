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
    // Create ring geometry for the washer faces
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 32)
    
    return (
        <group position={position} rotation={rotation}>
            {/* Top face of washer */}
            <mesh position={[height / 2, 0, 0]}>
                <meshPhysicalMaterial
                    color="#C0C0C0"
                    metalness={0.8}
                    roughness={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>
            
            {/* Bottom face of washer */}
            <mesh position={[-height / 2, 0, 0]} rotation={[Math.PI/2,0, 0]} geometry={ringGeometry}>
                <meshPhysicalMaterial
                    color="#C0C0C0"
                    metalness={0.8}
                    roughness={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>
            
            {/* Outer edge of washer */}
            <mesh renderOrder={1}>
                <cylinderGeometry args={[outerRadius, outerRadius, height, 32, 1, true]} />
                <meshPhysicalMaterial
                    color="#C0C0C0"
                    metalness={0.8}
                    roughness={0.2}
                    transparent={false}
                    opacity={0.7}
                />
            </mesh>
            
            {/* Golden inner edge highlight */}
            <mesh renderOrder={2}>
                <cylinderGeometry args={[innerRadius - 0.01, innerRadius + 0.02, height, 32, 1, true]} />
                <meshStandardMaterial
                    color="#FFD700"
                    metalness={0.6}
                    roughness={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    )
}

export default HollowWasher
