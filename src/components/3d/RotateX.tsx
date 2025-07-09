import React from "react"
import { useSpring, animated } from "@react-spring/three"

interface RotateXProps {
    isRotating: boolean
    children: React.ReactNode
    onRotationComplete?: () => void
}

const RotateX: React.FC<RotateXProps> = ({ isRotating, children, onRotationComplete }) => {
    const { rotation } = useSpring({
        rotation: isRotating ? [Math.PI * 2, 0, 0] as [number, number, number] : [0, 0, 0] as [number, number, number],
        config: { duration: 3000 },
        onRest: () => {
            if (onRotationComplete) onRotationComplete()
        }
    })
    
    return (
        // @ts-ignore for now to bypass typing issues
        <animated.group rotation={rotation}>
            {children}
        </animated.group>
    )
}

export default RotateX
