import React from 'react'
import 'katex/dist/katex.css'
import { BlockMath } from 'react-katex'
import { NumericFormat } from 'react-number-format'
import './Formula.css'

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
        <h2 className="title">Disc Method</h2>
        
        <div className="content">
            <div className="formula-section">
                <BlockMath math={`V = \\pi\\int_{${lowerBound}}^{${upperBound}}[${userFunction}]^2\\,dx`} />
                <div className="explanation">
                    <p>V = volume (after rotation)</p>
                    <p>a = smallest value of x</p>
                    <p>b = largest value of x</p>
                    <p>r = radius</p>
                    <p className="note">Dont worry if you don't understand this now</p>
                </div>
            </div>

            <div className="inputs">
                <div className="input-field">
                    <label>Lower Bound (a)</label>
                    <NumericFormat
                        value={lowerBound}
                        onValueChange={({ floatValue }) => setLowerBound(floatValue ?? 0)}
                        allowNegative={true}
                        className="input"
                    />
                </div>
                <div className="input-field">
                    <label>Upper Bound (b)</label>
                    <NumericFormat
                        value={upperBound}
                        onValueChange={({ floatValue }) => setUpperBound(floatValue ?? 0)}
                        allowNegative={true}
                        className="input"
                    />
                </div>
                <div className="input-field">
                    <label>Function f(x)</label>
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
