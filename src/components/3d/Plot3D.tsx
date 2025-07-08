import React, { useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { evaluate } from 'mathjs'  // NEW: Import math.js
import Axis from "./Axis"
//TODO: Read and understand this equation

// NEW: Component to draw the function curve with math.js
const FunctionCurve: React.FC<{ func: string; a: number; b: number }> = ({ func, a, b }) => {
    console.log('FunctionCurve received:', { func, a, b })
    
    const points = useMemo(() => {
        const arr: number[] = []
        
        console.log(`Calculating points for ${func} from ${a} to ${b}`)
        
        for (let x = a; x <= b; x += 0.1) {
            try {
                const y = evaluate(func, { x }) as number
                arr.push(x, y, 0)
            } catch (e) {
                arr.push(x, x * x, 0)
            }
        }
        
        return arr
    }, [func, a, b])

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[new Float32Array(points), 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial color="yellow" />
        </line>
    )
}


// TypeScript interface for Plot3D props
interface Plot3DProps {
    userFunction?: string
    lowerBound?: number
    upperBound?: number
}

// Accept props for function and bounds
const Plot3D: React.FC<Plot3DProps> = ({ 
    userFunction = "x^2", 
    lowerBound = 0, 
    upperBound = 1
}) => {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas camera={{ position: [4, 4, 10], fov: 60 }}>
                {/* X axis: red */}
                <Axis len={10} color="red" dir={[1, 0, 0]} label="x" />
                {/* Y axis: green */}
                <Axis len={10} color="blue" dir={[0, 1, 0]} label="y" />
                {/* Z axis: blue */}
                <Axis len={10} color="green" dir={[0, 0, 1]} label="z" />
                
                {/* NEW: Draw the function curve using the props */}
                <FunctionCurve func={userFunction} a={lowerBound} b={upperBound} />
                
                {/* Optional: Grid on the XY plane */}
                <gridHelper args={[10, 10] as [number, number]} rotation={[Math.PI / 2, 0, 0]} />
                {/* Allow user to rotate/zoom the camera */}
                <OrbitControls />
                {/* Add a little ambient light */}
                <ambientLight intensity={0.5} />
            </Canvas>
        </div>
    )
}

export default Plot3D
