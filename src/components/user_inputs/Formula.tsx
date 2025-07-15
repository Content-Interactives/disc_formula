import React from 'react'
import 'katex/dist/katex.css'
import { BlockMath } from 'react-katex'
import { NumericFormat } from 'react-number-format'
import './Formula.css'
import { COLORS } from '../utils/colors'


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
            </div>
            {/* the inputs the user puts in, on the right of the formula*/}
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
