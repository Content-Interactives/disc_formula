export type MethodType = 'disc' | 'washer' | 'shell'

export interface MethodConfig {
    name: string
    formula: string
    description: string
    color: string
    functionCount: number  // How many functions this method needs
    functionLabels: string[]  // Labels for each function input
    rotationAxis: 'x' | 'y'  // Which axis we rotate around
}

export const METHOD_CONFIGS: Record<MethodType, MethodConfig> = {
    disc: {
        name: "Disc Method",
        formula: "V = \\pi\\int_{{LOWER_BOUND}}^{{UPPER_BOUND}}[{FUNCTION_1}]^2\\,dx",
        description: "Rotating around x-axis using circular discs",
        color: "#FFD700",
        functionCount: 1,
        functionLabels: ["f(x)"],
        rotationAxis: 'x'
    },
    washer: {
        name: "Washer Method", 
        formula: "V = \\pi\\int_{{LOWER_BOUND}}^{{UPPER_BOUND}}\\left[{FUNCTION_1}\\right]^2 - \\left[{FUNCTION_2}\\right]^2\\,dx",
        description: "Rotating around x-axis with hollow discs (outer - inner)",
        color: "#FF7F50",
        functionCount: 2,
        functionLabels: ["R(x) (outer)", "r(x) (inner)"],
        rotationAxis: 'x'
    },
    shell: {
        name: "Shell Method",
        formula: "V = 2\\pi\\int_{{LOWER_BOUND}}^{{UPPER_BOUND}}x \\cdot {FUNCTION_1}\\,dx", 
        description: "Rotating around y-axis using cylindrical shells",
        color: "#9370DB",
        functionCount: 1,
        functionLabels: ["f(x)"],
        rotationAxis: 'y'
    }
} as const 