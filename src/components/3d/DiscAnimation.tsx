


// src/components/3d/DiscAnimation.tsx
import React, { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Cylinder, Group } from '@react-three/drei'
import { evalFn3D } from '../utils/mathUtils'

interface DiscAnimationProps {
    discAnim: boolean          // controls if discs are animating
    onComplete?: () => void    // called when all discs are shown
    fx: string                 // the function f(x)
    a: number                  // lower bound
    b: number                  // upper bound
}

const DiscAnimation: React.FC<DiscAnimationProps> = ({
    discAnim,
    onComplete,
    fx,
    a,
    b
}) => {
    const groupRef = useRef<Group>(null)
    
    // Calculate disc sizes and positions
    const getDiscData = () => {
        const discs = []
        const steps = 10  // Start with fewer discs first
        const dx = (b - a) / steps
        
        for(let x = a; x <= b; x += dx) {
            const radius = evalFn3D(fx, x)  // Get radius from function
            discs.push({
                position: [x, 0, 0],
                radius: radius,
                height: dx     // disc thickness
            })
        }
        return discs
    }

    // Rest of the component...
}