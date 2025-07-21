import React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Axis from "../Axis"

interface SceneProps {
    children: React.ReactNode
    graphSize?: number
    cameraPosition?: [number, number, number]
    background?: string
}

const Scene: React.FC<SceneProps> = ({ 
    children, 
    graphSize = 100,
    cameraPosition = [4, 4, 10],
    background = '#000'
}) => {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas 
                camera={{ position: cameraPosition, fov: 60 }}
                style={{ background }}
            >
                {/* Lighting Setup */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={5} />
                <directionalLight position={[-10, 10, 5]} intensity={3} />
                <directionalLight position={[0, -10, 5]} intensity={2} />
                <pointLight position={[0, 0, 10]} intensity={2} />
                
                {/* Coordinate System */}
                <Axis len={graphSize} color="red" dir={[1, 0, 0]} label="x" />
                <Axis len={graphSize} color="blue" dir={[0, 1, 0]} label="y" />
                <Axis len={graphSize} color="green" dir={[0, 0, 1]} label="z" />
                
                <gridHelper args={[graphSize, graphSize]} rotation={[Math.PI / 2, 0, 0]} />
                
                {/* Method-specific content */}
                {children}
                
                <OrbitControls />
            </Canvas>
        </div>
    )
}

export default Scene 