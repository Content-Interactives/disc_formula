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

const phases = [
    { stepSize: 0.5, speed: 0.1 },    
    { stepSize: 0.25, speed: 0.2 },     
    { stepSize: 0.12, speed: 0.4 },    
    { stepSize: 0.06, speed: 0.8 },
    { stepSize: 0.03, speed: 1.6 },
    { stepSize: 0.01, speed: 3.2 }        
]


const DiscAnimation: React.FC<DiscAnimationProps> = ({
    active,
    userFn,
    lowerBound,
    upperBound
}) => {
    const [visibleDiscs, setVisibleDiscs] = useState(0)
    const [phase, setPhase] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    
    // Reset when active changes
    React.useEffect(() => {
        if (!active) {
            setVisibleDiscs(0)
            setPhase(0)
            setIsComplete(false)
        }
    }, [active])
    
    const discs = React.useMemo(() => {
        if (!active) return []
        
        const arr: DiscData[] = []
        const stepSize = phases[phase].stepSize
        
        try {
            for (let x = lowerBound; x <= upperBound; x += stepSize) {
                const baseRadius = Math.abs(evalFn3D(userFn, x))
                
                
                arr.push({
                    position: [x, 0, 0] as [number, number, number],
                    rotation: [0, 0, Math.PI/2] as [number, number, number],
                    radius: baseRadius,
                    height: stepSize
                })
            }
            return arr
        } catch (e) { return [] }
    }, [userFn, lowerBound, upperBound, phase, active])

    useFrame(() => {
        if (!active || isComplete) return

        if (visibleDiscs < discs.length) {
            setVisibleDiscs(prev => prev + phases[phase].speed)
        } else if (phase < phases.length - 1) {
            setVisibleDiscs(0)
            setPhase(prev => prev + 1)
        } else {
            setIsComplete(true)
        }
    })

    if (!active) return null

    return (
        <group>
            {discs.slice(0, Math.floor(visibleDiscs)).map((disc, i) => (
                <React.Fragment key={i}>
                    <Cylinder
                        position={disc.position}
                        rotation={disc.rotation}
                        args={[disc.radius, disc.radius, disc.height, 32]}
                    >
                        <meshPhysicalMaterial
                            color="black"
                            metalness={0.7}
                            roughness={0.4}
                            opacity={1}
                            transparent={false}
                        />
                    </Cylinder>

                    <Cylinder
                        position={disc.position}
                        rotation={disc.rotation}
                        args={[disc.radius * 0.5, disc.radius * 0.5, disc.height * 1.01, 32]}
                    >
                        <meshStandardMaterial
                            color="#FFD700"
                            metalness={0}
                            roughness={0.5}
                        />
                    </Cylinder>
                </React.Fragment>
            ))}
        </group>
    )
}

export default DiscAnimation