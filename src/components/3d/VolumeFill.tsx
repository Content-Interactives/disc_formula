import React, { useMemo } from 'react'
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { evaluate } from 'mathjs'
import { Vector3, BufferGeometry, LineBasicMaterial, Line } from 'three'

const TestFillCurve: React.FC<{ func: string; a: number; b: number }> = ({ func, a, b }) => {
    const { geometry, material } = useMemo(() => {
        const points: Vector3[] = []
        
        console.log('Creating fill curve from', a, 'to', b)
        
        // 1. Start at bottom-left
        points.push(new Vector3(a, 0, 0))
        console.log('Start point:', a, 0, 0)
        
        // 2. Trace the curve
        for (let x = a; x <= b; x += 0.1) {
            try {
                const y = evaluate(func, { x }) as number
                points.push(new Vector3(x, y, 0))
                console.log('Curve point:', x, y, 0)
            } catch (e) {
                const y = x * x
                points.push(new Vector3(x, y, 0))
                console.log('Fallback point:', x, y, 0)
            }
        }
        
        // 3. Go to bottom-right
        points.push(new Vector3(b, 0, 0))
        console.log('End point:', b, 0, 0)
        
        // 4. Close back to start
        points.push(new Vector3(a, 0, 0))
        console.log('Close point:', a, 0, 0)
        
        const geometry = new BufferGeometry().setFromPoints(points)
        const material = new LineBasicMaterial({ 
            color: 'red',
            transparent: true,
            opacity: 0.8
        })
        
        return { geometry, material }
    }, [func, a, b])

    return <primitive object={new Line(geometry, material)} />
}

const VolumeFill: React.FC = () => {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas camera={{ position: [2, 2, 5], fov: 60 }}>
                <TestFillCurve func="x^2" a={0} b={1} />
                
                <gridHelper args={[5, 5]} rotation={[Math.PI / 2, 0, 0]} />
                <OrbitControls />
                <ambientLight intensity={0.8} />
            </Canvas>
        </div>
    )
}

export default VolumeFill