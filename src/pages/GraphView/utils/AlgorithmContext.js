import {useContext, createContext} from 'react';
import Algorithm from 'utils/Algorithm/Algorithm';


/**
 * @typedef {import("utils/Algorithm/Algorithm").default} Algorithm
 */

/**
 * @typedef AlgorithmContextObject Contains all the functions and helpers provided by AlgorithmContext
 * @property {Algorithm} algorithm Current algorithm
 * @property {Function} setAlgorithm Set the current algorithm
 */

/**
 * Creates the AlgorithmContextObject
 * @param {Object} algorithm The current algorithm
 * @param {Function} setAlgorithm Sets the current algorithm
 * @returns An AlgorithmContext object
 */
export function createAlgorithmContextObject(algorithm, setAlgorithm) {

    function setAlgorithmWrapper() {
        
    }

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