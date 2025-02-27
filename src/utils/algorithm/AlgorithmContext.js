import {useContext, createContext} from 'react';

/**
 * Creates the AlgorithmContextObject
 * @param {Object} algorithm The current algorithm
 * @param {Function} setAlgorithm Sets the current algorithm
 * @returns An AlgorithmContext object
 */
export function createAlgorithmContextObject(algorithm, setAlgorithm) {
    return {
        algorithm,
        setAlgorithm
    }
}

export const AlgorithmContext = createContext();


/**
 * Returns the AlgorithmContext
 * Improves readability, same as doing useContext(AlgorithmContext)
 * @returns {AlgorithmContextObject}
 */
export function useAlgorithmContext() {
    return useContext(AlgorithmContext);
}


export default AlgorithmContext;