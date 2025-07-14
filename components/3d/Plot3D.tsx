import React, { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls} from "@react-three/drei"
import { evaluate } from 'mathjs'
import Axis from "./Axis"
import RotateX from "./RotateX"
import { Line } from "@react-three/drei"

// Component to draw the function curve with math.js
const FunctionCurve: React.FC<{ func: string; a: number; b: number }> = ({ func, a, b }) => {
    const points = useMemo(() => {
        const pointsArray: [number, number, number][] = []
        
        // We need this messy code inorder to prevent a crash when the user types in 4 for lower bound and 3 for upper bound
        const lower = Math.min(a, b)
        const upper = Math.max(a, b)
        const stepSize = 0.1
        const numSteps = Math.floor((upper - lower) / stepSize)
        
        // Create the lines, one at a time to form the function
        for (let i = 0; i < numSteps + 1; i++) { 
            const x = lower + i * stepSize
            
            try { // We need the try, catch here incase the user puts in invalid expressions
                const y = evaluate(func, { x }) as number
                pointsArray.push([x, y * y, 0])  // Square for disc method
            } catch (e) {
                pointsArray.push([x, x * x, 0])  // Fallback
            }
        }
        
        return pointsArray
    }, [func, a, b])

    return (
        <Line
            points={points}
            color="yellow"
            lineWidth={5}
            transparent={true}
            opacity={0.5}
        />
    )
}

// TypeScript interface for Plot3D props
interface Plot3DProps {
    userFunction?: string
    lowerBound?: number
    upperBound?: number
    graphSize?: number
    isRotating?: boolean
    onRotationComplete?: () => void  // Add this
}

// Accept props for function and bounds
const Plot3D: React.FC<Plot3DProps> = ({ 
    userFunction = "x^2", 
    lowerBound = 0, 
    upperBound = 0,
    graphSize = 20, // 20 -> 20x20 graph for whole xy grid
    isRotating = false,
    onRotationComplete  // Add this
}) => {
    const safeEval = (func: string, x: number) => {
        try {
            const y = evaluate(func, { x }) as number
            return y * y  // Square for disc method
        } catch (e) {
            return x * x  // Fallback
        }
    }

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas camera={{ position: [4, 4, 10], fov: 60 }}>
                {/* X axis: red */}
                <Axis len={graphSize} color="red" dir={[1, 0, 0]} label="x" />
                {/* Y axis: green */}
                <Axis len={graphSize} color="blue" dir={[0, 1, 0]} label="y" />
                {/* Z axis: blue */}
                <Axis len={graphSize} color="green" dir={[0, 0, 1]} label="z" />
                
                {/* Only the function curve rotates */}
                <RotateX isRotating={isRotating} onComplete={onRotationComplete}>
                    {/* Draw the function curve using the props */}
                    <FunctionCurve func={userFunction} a={lowerBound} b={upperBound} />
                    {/* Draw the bounding lines */}
                    <Line points={[[lowerBound, safeEval(userFunction, lowerBound), 0], [lowerBound, 0, 0]]} color="yellow" lineWidth={2} transparent opacity={0.6} />
                    <Line points={[[upperBound, safeEval(userFunction, upperBound), 0], [upperBound, 0, 0]]} color="yellow" lineWidth={2} transparent opacity={0.6} />
                </RotateX>

                
                {/* Optional: Grid on the XY plane */}
                <gridHelper args={[graphSize, graphSize] as [number, number]} rotation={[Math.PI / 2, 0, 0]} />
                {/* Allow user to rotate/zoom the camera */}
                <OrbitControls />
            </Canvas>
        </div>
    )
}

export default Plot3D
