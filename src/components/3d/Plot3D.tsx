import React from "react"
import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Line } from "@react-three/drei"
import Axis from "./Axis"
import RotateX from "./RotateX"
import DiscAnimation from "./DiscAnimation"
import { generateFunctionPoints, evalFn2D } from '../utils/mathUtils'
import { COLORS } from '../utils/colors'
import DiscSurface from "./DiscSurface"


interface Plot3DProps {
    userFn: string
    lowerBound: number
    upperBound: number
    graphSize?: number
    rotationBtn: boolean
    discBtn: boolean
    toggleRotate: (value: boolean) => void  // add this
}

const Plot3D: React.FC<Plot3DProps> = ({ 
    userFn, 
    lowerBound, 
    upperBound,
    graphSize = 100,
    rotationBtn = false,
    discBtn = false,
    toggleRotate,
}) => {
    const [showSurface, setShowSurface] = useState(false)

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas 
                camera={{ position: [4, 4, 10], fov: 60 }}
                style={{ 
                    background: '#000',
                }}
            >
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={5} />
                
                {/* Add these new lights */}
                <directionalLight position={[-10, 10, 5]} intensity={3} />  {/* Light from opposite side */}
                <directionalLight position={[0, -10, 5]} intensity={2} />   {/* Light from below */}
                <pointLight position={[0, 0, 10]} intensity={2} />          {/* Light from front */}
                
                <Axis len={graphSize} color="red" dir={[1, 0, 0]} label="x" />
                <Axis len={graphSize} color="blue" dir={[0, 1, 0]} label="y" />
                <Axis len={graphSize} color="green" dir={[0, 0, 1]} label="z" />
                
                <gridHelper args={[graphSize, graphSize]} rotation={[Math.PI / 2, 0, 0]} />

                {/* toggleDisc(true) enables the disc Animation to now be pressed*/}
                <RotateX 
                    rotationBtn={rotationBtn} 
                    onComplete={() => {
                        toggleRotate(false);
                        setShowSurface(true);  // Show surface when rotation completes
                    }}
                >  
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

                <DiscSurface 
                    active={showSurface}  // Use separate surface state
                    userFn={userFn}         // Need to pass this from Plot3D
                    lowerBound={lowerBound} // Need to pass this from Plot3D
                    upperBound={upperBound} // Need to pass this from Plot3D
                    
                />

                <DiscAnimation 
                    active={discBtn}      // This stays controlled by discBtn
                    userFn={userFn}
                    lowerBound={lowerBound}
                    upperBound={upperBound}
                />

                
                
                <OrbitControls />
            </Canvas>
        </div>
    )
}

export default Plot3D
