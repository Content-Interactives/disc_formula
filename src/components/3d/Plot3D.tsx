import React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Line } from "@react-three/drei"
import Axis from "./Axis"
import RotateX from "./RotateX"
import { generateFunctionPoints, evalFn2D } from '../utils/mathUtils'
import { COLORS } from '../utils/colors'

interface Plot3DProps {
    userFn: string
    lowerBound: number
    upperBound: number
    graphSize?: number
    rotationBtn: boolean
    toggleDisc: (value: boolean) => void  // add this
}

const Plot3D: React.FC<Plot3DProps> = ({ 
    userFn, 
    lowerBound, 
    upperBound,
    graphSize = 100,
    rotationBtn = false,
    toggleDisc,
}) => {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas 
                camera={{ position: [4, 4, 10], fov: 60 }}
                style={{ 
                    background: '#000',
                }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                
                <Axis len={graphSize} color="red" dir={[1, 0, 0]} label="x" />
                <Axis len={graphSize} color="blue" dir={[0, 1, 0]} label="y" />
                <Axis len={graphSize} color="green" dir={[0, 0, 1]} label="z" />
                
                <gridHelper args={[graphSize, graphSize]} rotation={[Math.PI / 2, 0, 0]} />

                {/* toggleDisc(true) enables the disc Animation to now be pressed*/}
                <RotateX rotationBtn={rotationBtn} onComplete={() => toggleDisc(true)}>  
                    {/* This part does the 3D "volume" */}
                    <Line 
                        points={generateFunctionPoints(userFn, lowerBound, upperBound)}
                        color="yellow"
                        lineWidth={2}
                        transparent={true}
                        opacity={0.8}
                    />
                    {/* Boundary lines */}
                    <Line 
                        points={[[lowerBound, evalFn2D(userFn, lowerBound), 0], [lowerBound, 0, 0]]}
                        color={COLORS.lowerBound} 
                        lineWidth={6} 
                        transparent={true}
                        opacity={0.3} 
                    />
                    <Line 
                        points={[[upperBound, evalFn2D(userFn, upperBound), 0], [upperBound, 0, 0]]}
                        color={COLORS.upperBound} 
                        lineWidth={6} 
                        transparent={true}
                        opacity={0.3} 
                    />
                </RotateX>

                
                
                <OrbitControls />
            </Canvas>
        </div>
    )
}

export default Plot3D
