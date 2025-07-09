import React, { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls} from "@react-three/drei"
import { evaluate } from 'mathjs'  // NEW: Import math.js
import Axis from "./Axis"
import { Line } from "@react-three/drei"
//TODO: Read and understand this equation

// NEW: Component to draw the function curve with math.js
const FunctionCurve: React.FC<{ func: string; a: number; b: number }> = ({ func, a, b }) => {
    const { points, rectangles } = useMemo(() => {
        const pointsArray: [number, number, number][] = []
        const rectangles = []
        
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
                pointsArray.push([x, y, 0])
                
                if (i < numSteps) {
                    rectangles.push(
                        // We have this cursed 0.01 since its for the negative red looking rectangles, When the furve is downwards
                        <mesh key={i} position={[x + stepSize/2, y/2, y >= 0 ? 0 : 0.01]}>

                            {/* ThreeJS is cursed, so this is where the CENTER of the rectangle is */}
                            <planeGeometry args={[stepSize, Math.abs(y)]} />
                            {/* Render each mini triangle*/}
                            <meshBasicMaterial color={y >= 0 ? "lightblue" : "lightcoral"} transparent opacity={0.5}/>
                        </mesh>
                    )
                }
            } catch (e) {
                pointsArray.push([x, x * x, 0])
            }
        }
        
        return { points: pointsArray, rectangles }
    }, [func, a, b])

    return (
        <>
         {/* function line visual details */}
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
