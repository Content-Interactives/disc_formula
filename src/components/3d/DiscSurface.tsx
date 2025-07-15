// src/components/3d/DiscSurface.tsx
import { LatheGeometry, Vector2 } from 'three'
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
    points.push(new Vector2(y, x)) // (radius, height)
  }

  return (
    <mesh rotation={[0, 0, Math.PI / 2]}>  {/* Rotate 90 degrees around X axis */}
      <latheGeometry args={[points]} />
      <meshPhongMaterial 
        color="gray"    // Royal Blue - stands out against black background
        transparent={true}
        opacity={0.5}      // Very transparent to see through
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default DiscSurface
