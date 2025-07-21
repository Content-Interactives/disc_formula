import React from 'react'
import type { WasherData } from '../../types'
import HollowWasher from './components/HollowWasher'

interface WasherAnimationProps {
    washers: WasherData[]
    visibleWashers: number
    showWashers: boolean
}

const WasherAnimation: React.FC<WasherAnimationProps> = ({
    washers,
    visibleWashers,
    showWashers
}) => {
    if (!showWashers) return null

    return (
        <group>
            {washers.slice(0, Math.floor(visibleWashers)).map((washer, i) => (
                <HollowWasher
                    key={i}
                    position={washer.position}
                    rotation={washer.rotation}
                    outerRadius={washer.outerRadius}
                    innerRadius={washer.innerRadius}
                    height={washer.height}
                />
            ))}
        </group>
    )
}

export default WasherAnimation 