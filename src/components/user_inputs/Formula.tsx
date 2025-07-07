import React, { useState } from "react"
import "katex/dist/katex.min.css"
import "./Formula.css"
import { BlockMath } from "react-katex"

const Formula = () => {
    const [userFunction, setUserFunction] = useState("x^2")
    const [lowerBound, setLowerBound] = useState(0)
    const [upperBound, setUpperBound] = useState(1)

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
            
            <BlockMath math={`V = \\pi \\int_{${lowerBound}}^{${upperBound}} [${userFunction}]^2 dx`} />
        </div>
    )
}

export default Formula
// CSS styling
