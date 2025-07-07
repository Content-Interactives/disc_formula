
import React from "react"
import "katex/dist/katex.min.css"
import "./Formula.css"
import { BlockMath } from "react-katex"

// NEW: TypeScript interface for the props
interface FormulaProps {
    userFunction: string
    lowerBound: number
    upperBound: number
    setUserFunction: (value: string) => void
    setLowerBound: (value: number) => void
    setUpperBound: (value: number) => void
}

// CHANGED: Now accepts props with proper TypeScript typing
const Formula: React.FC<FormulaProps> = ({ userFunction, lowerBound, upperBound, setUserFunction, setLowerBound, setUpperBound }) => {
    return (
        <div className="formula-container">
            <div className="integral-input">
                <span>∫</span>
                <input 
                    type="number" 
                    value={lowerBound} 
                    onChange={(e) => setLowerBound(Number(e.target.value))} 
                    placeholder="a" 
                />
                <span>to</span>
                <input 
                    type="number" 
                    value={upperBound} 
                    onChange={(e) => setUpperBound(Number(e.target.value))} 
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
            
            <BlockMath math={`V = \\pi \\int_{${lowerBound}}^{${upperBound}} ${userFunction} dx`} />
        </div>
    )
}

export default Formula
// CSS styling
