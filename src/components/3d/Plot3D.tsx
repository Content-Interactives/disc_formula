import React, { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Shape } from "@react-three/drei"
import { evaluate } from 'mathjs'  // NEW: Import math.js
import Axis from "./Axis"
import { Line } from "@react-three/drei"
//TODO: Read and understand this equation

// NEW: Component to draw the function curve with math.js
const FunctionCurve: React.FC<{ func: string; a: number; b: number }> = ({ func, a, b }) => {
    const { points, rectangles } = useMemo(() => {
        const pointsArray: [number, number, number][] = []
        const rectangles = []
        
        for (let x = a; x <= b + 0.001; x += 0.1) { // We need b + 0.00001 due to the fact of off by 1 error
            try {
                const y = evaluate(func, { x }) as number
                pointsArray.push([x, y, 0])
                
                // Create a rectangle from x to x+0.1
                const nextX = x - 0.1
                const nextY = evaluate(func, { x: nextX }) as number
                
                rectangles.push(
                    <Line
                        key={x}
                        points={[
                            [x, 0, 0],           // Bottom left
                            [x, y, 0],           // Top left
                            [nextX, nextY, 0],   // Top right
                            [nextX, 0, 0],       // Bottom right
                            [x, 0, 0]            // Close
                        ]}
                        color="white"
                        transparent
                        opacity={0.3}
                    />
                )
            } catch (e) {
                pointsArray.push([x, x * x, 0])
            }
        }
        
        return { points: pointsArray, rectangles }
    }, [func, a, b])

    return (
        <>
            <Line
                points={points}
                color="yellow"
                lineWidth={5}
                transparent={true}
                opacity={0.5}
            />
            {rectangles}
        </>
    )
}


// TypeScript interface for Plot3D props
interface Plot3DProps {
    userFunction?: string
    lowerBound?: number
    upperBound?: number
    graphSize?: number // Add this
}

// Accept props for function and bounds
const Plot3D: React.FC<Plot3DProps> = ({ 
    userFunction = "x^2", 
    lowerBound = 0, 
    upperBound = 0,
    graphSize = 20 // 20 -> 20x20 graph for whole xy grid
}) => {
    const safeEval = (func: string, x: number) => {
        try {
            return evaluate(func, { x }) as number
        } catch (e) {
            return x // fallback
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
                
                {/* NEW: Draw the function curve using the props */}
                <FunctionCurve func={userFunction} a={lowerBound} b={upperBound} />
                {/* Draw the bounding lines */}
                <Line points={[[lowerBound, safeEval(userFunction, lowerBound), 0], [lowerBound, 0, 0]]} color="yellow" lineWidth={2} transparent opacity={0.6} />
                <Line points={[[upperBound, safeEval(userFunction, upperBound), 0], [upperBound, 0, 0]]} color="yellow" lineWidth={2} transparent opacity={0.6} />
                
                
                {/* Optional: Grid on the XY plane */}
                <gridHelper args={[graphSize, graphSize] as [number, number]} rotation={[Math.PI / 2, 0, 0]} />
                {/* Allow user to rotate/zoom the camera */}
                <OrbitControls />

            </Canvas>
        </div>
    )
}

export default Plot3D
