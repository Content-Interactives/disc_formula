import React from 'react'
import 'katex/dist/katex.css'
import { BlockMath } from 'react-katex'
import { NumericFormat } from 'react-number-format'
import './Formula.css'
import { COLORS } from '../utils/colors'
import type { MethodType } from '../3d/config/methodConfig'
import { METHOD_CONFIGS } from '../3d/config/methodConfig'


interface FormulaProps {
    userFunctions: string[]  // Array of functions
    lowerBound: number
    upperBound: number
    setUserFunctions: (functions: string[]) => void
    updateFunction: (index: number, value: string) => void
    setLowerBound: (lower: number) => void
    setUpperBound: (upper: number) => void
    selectedMethod: MethodType
    onMethodChange: (method: MethodType) => void
}

const Formula: React.FC<FormulaProps> = ({ 
    userFunctions, 
    lowerBound, 
    upperBound,
    setUserFunctions: _setUserFunctions,
    updateFunction,
    setLowerBound,
    setUpperBound,
    selectedMethod,
    onMethodChange
}) => {
    const methodConfig = METHOD_CONFIGS[selectedMethod]

    // Helper function to escape special characters for KaTeX
    const escapeForKaTeX = (str: string): string => {
        return str
            .replace(/\*/g, '')  // Remove * entirely since KaTeX handles adjacent variables as multiplication
            .replace(/\^/g, '^')         // Keep ^ as is for exponents
            .replace(/\(/g, '(')         // Keep parentheses as is
            .replace(/\)/g, ')')
            .replace(/(\d)([a-zA-Z])/g, '$1$2')  // Handle cases like "2x" -> "2x" (KaTeX renders this correctly)
            .trim()
    }

    // Generate the formula with proper function substitution
    const getFormattedFormula = () => {
        let formula = methodConfig.formula
        
        // Replace bounds with colored values
        formula = formula.replace('{LOWER_BOUND}', `\\color{${COLORS.lowerBound}}{${lowerBound}}`)
        formula = formula.replace('{UPPER_BOUND}', `\\color{${COLORS.upperBound}}{${upperBound}}`)
        
        // Replace functions based on method
        if (selectedMethod === 'disc') {
            const func = escapeForKaTeX(userFunctions[0] || 'x')
            formula = formula.replace('{FUNCTION_1}', `{\\color{${COLORS.function}}{${func}}}`)  // Contained color
        } else if (selectedMethod === 'washer') {
            const outerFunc = escapeForKaTeX(userFunctions[0] || '2x')
            const innerFunc = escapeForKaTeX(userFunctions[1] || 'x')
            formula = formula.replace('{FUNCTION_1}', `{\\color{#FF6B6B}{${outerFunc}}}`)  // Outer function in red, contained
            formula = formula.replace('{FUNCTION_2}', `{\\color{#4ECDC4}{${innerFunc}}}`)  // Inner function in teal, contained
        } else if (selectedMethod === 'shell') {
            const func = escapeForKaTeX(userFunctions[0] || 'x')
            formula = formula.replace('{FUNCTION_1}', `{\\color{${COLORS.function}}{${func}}}`)  // Contained color
        }
        
        // Debug log to see the final formula
        console.log('Final formula for', selectedMethod, ':', formula)
        
        return formula
    }

    return (
        <div className="formula-container">
            <div className="content">
                {/* Method Selection Buttons */}
                <div className="method-buttons">
                    {Object.entries(METHOD_CONFIGS).map(([method, config]) => (
                        <button
                            key={method}
                            onClick={() => onMethodChange(method as MethodType)}
                            className={`method-btn ${selectedMethod === method ? 'active' : ''}`}
                            style={{ 
                                backgroundColor: selectedMethod === method ? config.color : 'transparent',
                                borderColor: config.color
                            }}
                        >
                            {config.name}
                        </button>
                    ))}
                </div>

                <div className="formula-section">
                    <h2 className="title">{methodConfig.name}</h2>
                    <p className="description">{methodConfig.description}</p>

                    {/* Dynamic formula based on selected method */}
                                            <div className="formula-display">
                            <BlockMath 
                                math={getFormattedFormula()} 
                            />
                        </div>
                </div>
                
                {/* Dynamic inputs based on method */}
                <div className="inputs">
                    {/* Bounds inputs */}
                    <div className="input-field">
                        <label style={{ color: COLORS.upperBound }}>(b)</label>
                        <NumericFormat
                            value={upperBound === 2 ? '' : upperBound}
                            placeholder="2"
                            onValueChange={({ floatValue }) => setUpperBound(floatValue ?? 2)}
                            allowNegative={true}
                            className="input"
                        />
                    </div>

                    <div className="input-field">
                        <label style={{ color: COLORS.lowerBound }}>(a)</label>
                        <NumericFormat
                            value={lowerBound === 0 ? '' : lowerBound}
                            placeholder="0"
                            onValueChange={({ floatValue }) => setLowerBound(floatValue ?? 0)}
                            allowNegative={true}
                            className="input"
                        />
                    </div>

                    {/* Dynamic function inputs based on method */}
                    {methodConfig.functionLabels.map((label, index) => {
                        const isOuterFunction = selectedMethod === 'washer' && index === 0
                        const isInnerFunction = selectedMethod === 'washer' && index === 1
                        
                        const labelColor = isOuterFunction ? '#FF6B6B' : 
                            isInnerFunction ? '#4ECDC4' : 
                            COLORS.function

                        return (
                            <div key={index} className="input-field">
                                <label style={{ color: labelColor }}>
                                    {label}
                                </label>
                                <input
                                    type="text"
                                    value={userFunctions[index] || ''}
                                    onChange={(e) => updateFunction(index, e.target.value)}
                                    className="input"
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Formula
