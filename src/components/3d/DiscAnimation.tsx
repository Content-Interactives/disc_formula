// src/components/3d/DiscAnimation.tsx
import React, { useRef, useState } from "react"
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
    
    // Calculate all disc positions and sizes
    const discs = React.useMemo(() => {
        const discData: DiscData[] = []  // specify the type
        const steps = 20  // Start with 20 discs
        const dx = (upperBound - lowerBound) / steps
        
        for(let x = lowerBound; x <= upperBound; x += dx) {
            const radius = evalFn3D(userFn, x)
            discData.push({
                position: [x, 0, 0] as [number, number, number],
                rotation: [0, 0, Math.PI/2] as [number, number, number],
                radius: radius,
                height: dx
            })
        }
        return discData
    }, [userFn, lowerBound, upperBound])

    // Animation frame
    useFrame(() => {
        if (active && visibleDiscs < discs.length) {
            setVisibleDiscs(prev => prev + 0.1)  // Slow animation
        } else if (!active) {
            setVisibleDiscs(0)  // Reset when inactive
        }
    })

    if (!active) return null  // Don't render if not active

    return (
        <group>
            {discs.slice(0, Math.floor(visibleDiscs)).map((disc, i) => (
                <Cylinder
                    key={i}
                    position={disc.position as [number, number, number]}
                    rotation={disc.rotation as [number, number, number]}
                    args={[disc.radius, disc.radius, disc.height, 32]}
                    material-color="gray"
                    material-opacity={0.3}
                    material-transparent
                />
            ))}
        </group>
    )
}

export default DiscAnimation