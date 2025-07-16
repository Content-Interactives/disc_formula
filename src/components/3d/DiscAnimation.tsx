// src/components/3d/DiscAnimation.tsx
import React, { useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Cylinder } from '@react-three/drei'
import { evalFn3D } from '../utils/mathUtils'

interface DiscAnimationProps {
    active: boolean        // this is discBtn from App.tsx
    userFn: string
    lowerBound: number
    upperBound: number
}

interface DiscData {
    position: [number, number, number]
    rotation: [number, number, number]
    radius: number
    height: number
}

const DiscAnimation: React.FC<DiscAnimationProps> = ({
    active,
    userFn,
    lowerBound,
    upperBound
}) => {
    const [visibleDiscs, setVisibleDiscs] = useState(0)
    
    // Calculate an array of disc positions and sizes
    const discs = React.useMemo(() => {
        const arr: DiscData[] = []  // specify the type
        
        const dx = 0.1 // thickness of each disc
        
        for (let x = lowerBound; x <= upperBound; x += dx) {

            arr.push({
                position: [x, 0, 0] as [number, number, number],
                rotation: [0, 0, Math.PI/2] as [number, number, number],
                radius: evalFn3D(userFn, x),
                height: dx
            })
        }
        return arr
    }, [userFn, lowerBound, upperBound]) // This function will run again when the user changes the interactive function

    // Animation frame this runs 60 times per second
    useFrame(() => {
        if (active && visibleDiscs < discs.length) {
            setVisibleDiscs(prev => prev + 0.05)  // Slow animation
        } else if (!active) {
            setVisibleDiscs(0)  // Reset when inactive
        }
    })

    if (!active) return null  // Don't render if not active

    return (
        <group>
            {discs.slice(0, Math.floor(visibleDiscs)).map((disc, i) => (
                <>
                    <Cylinder
                        key={i}
                        position={disc.position as [number, number, number]}
                        rotation={disc.rotation as [number, number, number]}
                        args={[disc.radius, disc.radius, disc.height, 32]}
                    >
                        <meshPhysicalMaterial
                            color="black"           // Change from gray to black
                            metalness={0.7}        // Keep some metallic quality
                            roughness={0.4}        // Vinyl-like surface
                            opacity={1}            // Make it completely solid
                            transparent={false}    // Remove transparency
                        />
                    </Cylinder>

                    {/* Add a yellow center label */}
                    <Cylinder
                        key={`label-${i}`}
                        position={disc.position as [number, number, number]}
                        rotation={disc.rotation as [number, number, number]}
                        args={[disc.radius * 0.5, disc.radius * 0.5, disc.height * 1.01, 32]}
                    >
                        <meshStandardMaterial
                            color="#FFD700"        // Yellow gold color
                            metalness={0}          // Non-metallic
                            roughness={0.5}        // Paper-like finish
                        />
                    </Cylinder>
                </>
            ))}
        </group>
    )
}

export default DiscAnimation