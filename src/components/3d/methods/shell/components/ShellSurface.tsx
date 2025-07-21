import React from 'react'

interface ShellSurfaceProps {
    userFn: string
    lowerBound: number
    upperBound: number
    active: boolean
}

const ShellSurface: React.FC<ShellSurfaceProps> = ({ userFn: _userFn, lowerBound: _lowerBound, upperBound: _upperBound, active }) => {
    if (!active) return null
    
    // TODO: Implement cylindrical shell surface generation
    // This should create shells rotating around y-axis, not x-axis
    // Each shell has radius = x, height = f(x)
    
    return (
        <mesh>
            <cylinderGeometry args={[1, 1, 2, 16]} />
            <meshPhongMaterial 
                color="#9370DB"
                transparent={true}
                opacity={0.3}
                wireframe={true}
            />
        </mesh>
    )
}

export default ShellSurface 