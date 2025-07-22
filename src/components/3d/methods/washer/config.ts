import type { WasherPhase } from './types'

export const WASHER_PHASES: WasherPhase[] = [
    { stepSize: 0.5, speed: 0.1 },    // Phase 1: Large thick washers, slow
    { stepSize: 0.25, speed: 0.2 },   // Phase 2: Medium washers, faster  
    { stepSize: 0.12, speed: 0.4 },   // Phase 3: Smaller washers, even faster
    { stepSize: 0.06, speed: 0.8 },   // Phase 4: Thin washers, much faster
    { stepSize: 0.03, speed: 1.6 }    // Phase 5: Very thin washers, very fast
]

export const WASHER_ROTATION_SPEED = 2
export const WASHER_TRAIL_COUNT = 360  // Reduced from 720 due to double line rendering 