import React from 'react'
import 'katex/dist/katex.css'
import { BlockMath } from 'react-katex'
import { NumericFormat } from 'react-number-format'
import './Formula.css'


// src/components/utils/colors.ts
const COLORS = {
    lowerBound: '#90EE90',  // light green
    upperBound: '#87CEEB',  // light blue
    function: '#FFB74D'     // light orange
}

interface FormulaProps {
    userFunction: string
    lowerBound: number
    upperBound: number
    setUserFunction: (func: string) => void
    setLowerBound: (lower: number) => void
    setUpperBound: (upper: number) => void
}

const Formula: React.FC<FormulaProps> = ({ 
    userFunction, 
    lowerBound, 
    upperBound,
    setUserFunction,
    setLowerBound,
    setUpperBound
}) => (
    <div className="formula-container">
        
        <div className="content">
            <div className="formula-section">
                <h2 className="title">Disc Method</h2>

                {/* This is  important for coloring the variables, This solution is very cursed, bit if you remove that {white} it will oerflow the text with orange */}
                <BlockMath 
                    math={`V = \\pi\\int_{
                        \\color{${COLORS.lowerBound}}{${lowerBound}}
                    }^{
                        \\color{${COLORS.upperBound}}{${upperBound}}
                    }[
                        \\color{${COLORS.function}}{${userFunction}}

                    \\color{white}]^2\\,dx`} 
                />
                {/* <div className="explanation">
                    <p>V = volume (after rotation)</p>
                    <p>a = smallest value of x</p>
                    <p>b = largest value of x</p>
                    <p>r = radius</p>
                    <p className="note">Dont worry if you don't understand this now</p>
                </div> */}
            </div>

            <div className="inputs">
                
                <div className="input-field">
                    <label style={{ color: COLORS.upperBound }}>(b)</label>
                    <NumericFormat
                        value={upperBound}
                        onValueChange={({ floatValue }) => setUpperBound(floatValue ?? 0)}
                        allowNegative={true}
                        className="input"
                    />
                </div>

                <div className="input-field">
                    <label  style={{ color: COLORS.lowerBound }}>(a)</label>
                    <NumericFormat
                        value={lowerBound}
                        onValueChange={({ floatValue }) => setLowerBound(floatValue ?? 0)}
                        allowNegative={true}
                        className="input"
                    />
                </div>
                <div className="input-field">
                    <label style={{ color: COLORS.function }} >f(x)</label>
                    <input
                        type="text"
                        value={userFunction}
                        onChange={(e) => setUserFunction(e.target.value)}
                        className="input"
                    />
                </div>
            </div>
        </div>
    </div>
)

export default Formula
