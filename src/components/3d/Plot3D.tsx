import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Axis  from './Axis';



const Plot3D: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vw' }}>
      <Canvas camera={{ position: [0,0,5], fov: 60}}>
        {/* X axis: red */}
        <Axis len={10} color="red" dir={[1, 0, 0]} label="x" />
        {/* Y axis: green */}
        <Axis len={10} color="blue" dir={[0, 1, 0]} label="y" />
        {/* Z axis: blue */}
        <Axis len={10} color="green" dir={[0, 0, 1]} label="z" />
        {/* Optional: Grid on the XZ plane */}
        <gridHelper args={[10, 10]} />
        {/* Allow user to rotate/zoom the camera */}
        <OrbitControls />
        {/* Add a little ambient light */}
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
};

export default Plot3D;