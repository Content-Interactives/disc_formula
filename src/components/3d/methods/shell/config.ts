import type { ShellPhase } from './types'

export const SHELL_PHASES: ShellPhase[] = [
    { stepSize: 0.5, speed: 0.1 },    
    { stepSize: 0.25, speed: 0.2 },     
    { stepSize: 0.12, speed: 0.4 },    
    { stepSize: 0.06, speed: 0.8 },
    { stepSize: 0.03, speed: 1.6 }      
]

export const SHELL_ROTATION_SPEED = 2
export const SHELL_TRAIL_COUNT = 720 