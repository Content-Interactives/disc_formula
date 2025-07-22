import type { ShellPhase } from './types'

export const SHELL_PHASES: ShellPhase[] = [
    { stepSize: 0.5, speed: 0.03 },    // Coarse, very slow
    { stepSize: 0.25, speed: 0.05 },   // Medium, slow  
    { stepSize: 0.12, speed: 0.08 },   // Fine, moderate
    { stepSize: 0.06, speed: 0.12 },   // Very fine, faster
    { stepSize: 0.03, speed: 0.2 }     // Ultra fine, fastest
]

export const SHELL_ROTATION_SPEED = 2
export const SHELL_TRAIL_COUNT = 720 