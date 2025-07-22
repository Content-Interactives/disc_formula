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
        
        // Replace functions based on method with consistent defaults
        if (selectedMethod === 'disc') {
            const func = escapeForKaTeX(userFunctions[0] || 'x')
            formula = formula.replace('{FUNCTION_1}', `{\\color{${COLORS.function}}{${func}}}`)
        } else if (selectedMethod === 'washer') {
            const outerFunc = escapeForKaTeX(userFunctions[0] || '2x')  // R(x) default: 2x
            const innerFunc = escapeForKaTeX(userFunctions[1] || 'x')    // r(x) default: x
            formula = formula.replace('{FUNCTION_1}', `{\\color{#FF6B6B}{${outerFunc}}}`)
            formula = formula.replace('{FUNCTION_2}', `{\\color{#4ECDC4}{${innerFunc}}}`)
        } else if (selectedMethod === 'shell') {
            const func = escapeForKaTeX(userFunctions[0] || 'x')
            formula = formula.replace('{FUNCTION_1}', `{\\color{${COLORS.function}}{${func}}}`)
        }
        
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

                    {/* Dynamic formula based on selected method */}
                                            <div className="formula-display">
                            <BlockMath 
                                math={getFormattedFormula()} 
                            />
                        </div>
                </div>
                
                {/* Dynamic inputs based on method */}
                <div className="inputs">
                    {/* Bounds inputs - shared row */}
                    <div className="bounds-row">
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
                    </div>

                    {/* Dynamic function inputs based on method */}
                    {methodConfig.functionLabels.map((label, index) => {
                        const isOuterFunction = selectedMethod === 'washer' && index === 0
                        const isInnerFunction = selectedMethod === 'washer' && index === 1
                        
                        const labelColor = isOuterFunction ? '#FF6B6B' : 
                            isInnerFunction ? '#4ECDC4' : 
                            COLORS.function

                        // Get the appropriate default value for this method/function
                        let defaultValue = "x"
                        if (selectedMethod === 'washer') {
                            defaultValue = index === 0 ? "2x" : "x"  // R(x) outer, r(x) inner
                        } else if (selectedMethod === 'disc' || selectedMethod === 'shell') {
                            defaultValue = "x"  // f(x) for both
                        }

                        const currentValue = userFunctions[index] || ''
                        
                        // Check if we should show placeholder - more flexible logic
                        let shouldShowPlaceholder = false
                        if (currentValue === '' || currentValue === defaultValue) {
                            shouldShowPlaceholder = true
                        } else if (selectedMethod === 'disc' || selectedMethod === 'shell') {
                            // For disc/shell, also show placeholder for common defaults like "2x", "x", etc.
                            shouldShowPlaceholder = ['x', '2x', '2*x'].includes(currentValue)
                        }

                        return (
                            <div key={index} className="input-field">
                                <label style={{ color: labelColor }}>
                                    {label}
                                </label>
                                <input
                                    type="text"
                                    value={shouldShowPlaceholder ? '' : currentValue}
                                    placeholder={defaultValue}
                                    onChange={(e) => updateFunction(index, e.target.value)}
                                    className="input"
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
