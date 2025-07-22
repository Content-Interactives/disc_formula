import type { DiscPhase } from './types'

export const DISC_PHASES: DiscPhase[] = [
    { stepSize: 0.5, speed: 0.05},    
    { stepSize: 0.25, speed: 0.1 },     
    { stepSize: 0.12, speed: 0.4 },    
    { stepSize: 0.06, speed: 0.8 },
    { stepSize: 0.03, speed: 2.5 }      
]

export const DISC_ROTATION_SPEED = 2
export const DISC_TRAIL_COUNT = 720 