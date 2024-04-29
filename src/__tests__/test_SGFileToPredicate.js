import '@testing-library/jest-dom'
import { parseSGFText } from 'utils/SGFileToPredicate';

describe('Graph Text Parsing', () => {
  test('Correct parsing with mixed content', () => {
    const inputText = `n 1 10 20
n 2 15 25
e 1 2 5
e 2 1
directed
// This is a comment
# Another comment type
g This should be ignored
t Yet another line to ignore
- And another one
`;
    const expectedResult = {
      nodes: {
        '1': { y: 10, x: 20, weight: undefined, highlighted: false, marked: false, invisible: false, invisibleLabel: false, invisibleWeight: false },
        '2': { y: 15, x: 25, weight: undefined, highlighted: false, marked: false, invisible: false, invisibleLabel: false, invisibleWeight: false }
      },
      edges: {
        '1 2': { source: '1', target: '2', weight: 5, highlighted: false, shouldBeInvisible: false, invisible: false, invisibleLabel: false, invisibleWeight: false },
        '2 1': { source: '2', target: '1', weight: undefined, highlighted: false, shouldBeInvisible: false, invisible: false, invisibleLabel: false, invisibleWeight: false }
      },
      directed: true,
      message: "" 
    };

    const result = parseSGFText(inputText);
    expect(result.nodes).toEqual(expectedResult.nodes);
    expect(result.edges).toEqual(expectedResult.edges);
    expect(result.directed).toEqual(expectedResult.directed);
  });

  test('Handles incorrect formats ', () => {
    const incorrectFormats = [
      'n 1', 
      'e 1 2', 
      'wrongprefix 1 2', 
      'n 1 10 20 extra', 
      'e 1 2 5 extra' 
    ];

    incorrectFormats.forEach((text, index) => {
      expect(() => {
        parseSGFText(text);
      }).toThrow(Error, `Input file had an invalid line on line ${index + 1}`);
    });
  });

  test('Empty or whitespace-only lines are ignored', () => {
    const inputText = `
    
n 1 10 20
n 2 15 25
e 1 2

`;
    const expectedResult = {
      nodes: {
        '1': { y: 10, x: 20, weight: undefined, highlighted: false, marked: false, invisible: false, invisibleLabel: false, invisibleWeight: false },
        '2': { y: 15, x: 25, weight: undefined, highlighted: false, marked: false, invisible: false, invisibleLabel: false, invisibleWeight: false }
      },
      edges: {
        '1 2': { source: '1', target: '2', weight: undefined, highlighted: false, shouldBeInvisible: false, invisible: false, invisibleLabel: false, invisibleWeight: false }
      },
      directed: false,
      message: "" 
    };

    const result = parseSGFText(inputText);
    expect(result.nodes).toEqual(expectedResult.nodes);
    expect(result.edges).toEqual(expectedResult.edges);
    expect(result.directed).toEqual(expectedResult.directed);
  });

  
});