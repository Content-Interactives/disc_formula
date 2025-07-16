// src/components/3d/DiscSurface.tsx
import { Vector2 } from 'three'
import { evaluate } from 'mathjs'
import * as THREE from 'three';


interface DiscSurfaceProps {
  userFn: string      // like "x^2" or "2*x"
  lowerBound: number  // start of range
  upperBound: number  // end of range
  active: boolean     // only show after rotation
}

const DiscSurface = ({ userFn, lowerBound, upperBound, active }: DiscSurfaceProps) => {
  if (!active) return null
  
  const points: Vector2[] = []
  const steps = 50
  
  for (let i = 0; i <= steps; i++) {
    const x = lowerBound + ((upperBound - lowerBound) * i) / steps
    const y = Math.abs(evaluate(userFn, { x }))
 
    points.push(new Vector2(y, -x)) // (radius, -height to flip)
  }

  return (
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <latheGeometry args={[points]} />
      <meshPhongMaterial 
        color="#E0F2F1"
        transparent={true}
        opacity={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default DiscSurface
