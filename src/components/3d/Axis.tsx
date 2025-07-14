import React from "react"
import { Text, Billboard } from "@react-three/drei"

type AxisTypes = {
    //I hate JS so much, so TS helps and allows us to enforce types

    len: number // Length of the axis,
    color: string // color  of each line
    dir: [number, number, number] // x,y,z axis (ONLY 1 AT A TIME)
    label?: string // x,y,z, the "?" means that the label is OPTIONAL
}

const Axis: React.FC<AxisTypes> = ({ len, color, dir, label }) => {
    const buffer = len / 2 + 0.5 // we do half since the acis is technically 1 line that is through pos and negative of graph, also add an offset
    const colorBar: [number, number, number] = [0.05, 0.05, 0.05] // Thi sis the rendering for the x,y,z axis dimensions

    // find the coreect axis we render
    // i = 0 -> [1,0,0] OR [-1,0,0] AKA: x
    // i = 1 -> [0,1,0] OR [0,-1,0] AKA: y
    // i = 2 -> [0,0,1] OR [0,0,-1] AKA: z
    const i = dir.findIndex((val) => Math.abs(val) == 1)
    colorBar[i] = len
    const sign = dir[i]
    const labelPos: [number, number, number] = [0, 0, 0]
    labelPos[i] = sign * buffer // Draw the "x", "y", "z", on the corners

    return (
        <>
            <mesh>
                <boxGeometry args={colorBar}></boxGeometry>
                <meshBasicMaterial color={color}></meshBasicMaterial>
            </mesh>
            {/*prints a label only when given*/}
            {label && (
                <Billboard position={labelPos}>
                    <Text fontSize={0.5} color={color}>
                        {label}
                    </Text>
                </Billboard>
            )}
        </>
    )
}

export default Axis
