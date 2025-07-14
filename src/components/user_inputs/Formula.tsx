
import React from "react"
import "katex/dist/katex.min.css"
import "./Formula.css"
import { BlockMath } from "react-katex"
import { NumericFormat } from 'react-number-format' // 🆕 NEW: Import the library

// NEW: TypeScript interface for the props
interface FormulaProps {
    userFunction: string
    lowerBound: number
    upperBound: number
    setUserFunction: (value: string) => void
    setLowerBound: (value: number) => void
    setUpperBound: (value: number) => void
}

const Formula: React.FC<FormulaProps> = ({ userFunction, lowerBound, upperBound, setUserFunction, setLowerBound, setUpperBound }) => {
    return (
        <div className="formula-container">
            <div className="integral-input">
                <span>∫</span>
                <NumericFormat // 🔄 CHANGED: Simplified - only essential props
                    value={lowerBound}
                    onValueChange={(values) => setLowerBound(values.floatValue || 0)}
                    placeholder="a"
                />
                <span>to</span>
                <NumericFormat // 🔄 CHANGED: Simplified - only essential props
                    value={upperBound}
                    onValueChange={(values) => setUpperBound(values.floatValue || 0)}
                    placeholder="b"
                />
                <input 
                    type="text" 
                    value={userFunction} 
                    onChange={(e) => setUserFunction(e.target.value)} 
                    placeholder="f(x)" 
                />
                <span>dx</span>
            </div>
            
            <BlockMath math={`V = \\pi \\int_{${lowerBound}}^{${upperBound}} [${userFunction}] dx`} />
        </div>
    )
}

export default Formula
// CSS styling
