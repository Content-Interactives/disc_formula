import { useState, useMemo } from 'react'
import type { MethodType, MethodConfig } from '../config/methodConfig'
import { METHOD_CONFIGS } from '../config/methodConfig'

interface UseMethodConfigReturn {
    currentMethod: MethodType
    methodConfig: MethodConfig
    setMethod: (method: MethodType) => void
    availableMethods: MethodType[]
    getMethodConfig: (method: MethodType) => MethodConfig
}

export const useMethodConfig = (initialMethod: MethodType = 'disc'): UseMethodConfigReturn => {
    const [currentMethod, setCurrentMethod] = useState<MethodType>(initialMethod)
    
    const methodConfig = useMemo(() => METHOD_CONFIGS[currentMethod], [currentMethod])
    
    const availableMethods = useMemo(() => Object.keys(METHOD_CONFIGS) as MethodType[], [])
    
    const getMethodConfig = (method: MethodType): MethodConfig => METHOD_CONFIGS[method]
    
    const setMethod = (method: MethodType) => {
        if (availableMethods.includes(method)) {
            setCurrentMethod(method)
        }
    }
    
    return {
        currentMethod,
        methodConfig,
        setMethod,
        availableMethods,
        getMethodConfig
    }
} 