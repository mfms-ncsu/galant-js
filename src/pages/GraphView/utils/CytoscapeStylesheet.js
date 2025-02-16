/**
 * @fileoverview Contains some type definitions, and a function for creating cytoscape's stylesheet.
 * If you want to add more node and edge attributes, look here: https://js.cytoscape.org/ 
 * @author Julian Madrigal
 * @author Christina Albores
 */


/**
 * Contains preferences that users can change that will be considered during creating of stylesheet.
 * @typedef StyleSheetPreferences
 * @property {Object} node All preferences related to default node styling
 * @property {string} node.backgroundColor Background color of default nodes
 * @property {string} node.color Background color of default nodes
 * @property {Object} node.size Size of default nodes
 * @property {string} node.size.x X size of default nodes
 * @property {string} node.size.y Y size of default nodes
 * @property {string} node.textOpacity Background color of default nodes
 * @property {string} node.borderColor Background color of default nodes
 * @property {string} node.borderWidth Border width of default nodes
 * @property {string} node.backgroundOpacity Background color opacity of default nodes
 * @property {string} node.shape Shape of default nodes
 * @property {string} node.hideLabel When true, disables rendering of label text element
 * @property {string} node.hideWeight When true, disables rendering of weight text element
 * @property {Object} edge All preferences related to default edge styling
 * @property {string} edge.lineColor Line color of default edges
 * @property {string} edge.textOpacity Line color of default edges
 * @property {string} edge.width Edge width of default edges
 * @property {string} edge.hideLabel When true, disables inclusion of label in label
 * @property {string} edge.hideWeight When true, disables inclusion of weight in label
 */



/**
 * Contains the default styling that will be loaded on at the initial start (unless localStorage functionality is implemented)
 * Mostly empty, but allows for function to read preferences without encountering missing objects. 
 * In the future, may be populated with dynamic defaults.
 * @note Placing values here instead of in {@link createCytoscapeStyleSheet} allows for preference panels to dynamically set initial values
 * Prefereably set hard-coded defaults in function, and prioritize mutable defaults here. 
 * @author Julian Madrigal
 * @type {StyleSheetPreferences}
 */
export const defaultStylePreferences = {
    node: {
        backgroundColor: '#FFFFFF', // Use long hex format. Input fields don't display with shorthand format
        size: {x: 25, y: 25},
        color: '#000000',
		borderColor: '#AAAAAA',
		borderWidth: 2,
		backgroundOpacity: 1,
		shape: 'circle',
		hideWeight: false, // These are configured in cytoscapecomponent
		hideLabel: false // These are configured cytoscapecomponent
    },
    edge: {
        lineColor: '#444444',
		width: 3,
        color: '#AA0000',
		hideWeight: false,
		hideLabel: false
    },
}


/**
 * @typedef {Object} DataMapping Maps an element's data attribute to several style attributes to create a single CSS Rule
 * @property {'node' | 'edge'} selector - The selector for the styling rule
 * @property {string} data - Data attribute name
 * @property {string[]} styles - List of style attributes to map to the data attribute
 */



/**
 * Allows for mappings between a element's data attribute to a style attribute.
 * This makes it easier (and more readable) to create quick mappings for things such as labels, color, etc.
 * As the alg. API grows to allow element changes, this is where new mappings should be added.
 * @note These are data-to-styling mappings. NOT preferences-to-styling mappings. 
 * @author Julian Madrigal
 * @type {DataMapping[]} List of mappings
 */
const dataMappings = [
    {selector: 'node', data: 'color', styles:['backgroundColor']},
    {selector: 'node', data: 'id', styles:['label']}, // We may not need this, as it appears nodes use custom labels
	{selector: 'node', data: 'shape', styles:['shape']},
	{selector: 'node', data: 'borderColor', styles:['borderColor']},
	{selector: 'node', data: 'borderWidth', styles:['borderWidth']},
	{selector: 'node', data: 'backgroundOpacity', styles:['backgroundOpacity']},
	{selector: 'node', data: 'size', styles:['width', 'height']},
	{selector: 'edge', data: 'width', styles:['width']},
	{selector: 'edge', data: 'color', styles:['lineColor', 'targetArrowColor']}
];

/**
 * Helper function that just improves readability.
 * Allows syntax data(attribute) instead of doing 'data(attribute)'
 * @author Julian Madrigal
 * @param {string} attribute The data attribute
 * @returns String that can be read by cytoscape to indicate reference to element's data attribute.
 */
function data(attribute) {
    return `data(${attribute})`
}

/**
 * Create a CSS Rule to be added to stylesheet from a mapping
 * @author Julian Madrigal
 * @param {DataMapping} mapping
 */
function createCSSRuleFromDataMapping(mapping) {
    const rule = {
        selector: `${mapping.selector}[${mapping.data}]`,
        style: {}
    }

    for (const styleAttribute of mapping.styles) {
        rule.style[styleAttribute] = data(mapping.data);
    }

    return rule;
}

/**
 * Defines the stylesheet that can be used by cytoscape.
 * Allows users to provide an object which can replace certain styles in the sheet.
 * @note Maximize stylesheet use. Cytoscape performance worsens the more node-level styling is done.
 * @author Julian Madrigal 
 * @param {StyleSheetPreferences} preferences
 */
export function createCytoscapeStyleSheet(preferences=defaultStylePreferences) {
    const styleSheet = [
        {
            selector: 'node',
            style: {
                width: preferences.node.size.x + 'px',
                height: preferences.node.size.y + 'px',
                backgroundColor: preferences.node.backgroundColor,
                color: preferences.node.color,
                textOpacity: preferences.node.textOpacity,
                borderWidth: (preferences.node.size.x / 10) + 'px',
				borderStyle: 'solid',
				borderColor: preferences.node.borderColor,
				backgroundOpacity: preferences.node.backgroundOpacity,
				shape: preferences.node.shape,
				textValign: 'center',
				visibility: 'visible',
				fontSize: (preferences.node.size.x / 2) + 'px'
            }
        },
        {
            selector: 'edge',
            style: {
                label: data('id'),
                width: 3,
                lineColor: preferences.edge.lineColor,
                color: preferences.edge.color,
                textOpacity: preferences.edge.textOpacity,
                targetArrowColor: preferences.edge.lineColor,
                targetArrowShape: 'none',
                curveStyle: 'bezier'
            }
        },
		// Marked nodes
		{
			selector: 'node[?marked]',
			style: {
				backgroundColor: 'orange',
			}
		},
		// Highlighted nodes
		{
			selector: 'node[?highlighted]',
			style: {
				borderWidth: (preferences.node.size.x / 5) + 'px',
			}
		},
		// Invisible nodes
		{
			selector: 'node[?invisible]',
			style: {
				visibility: 'hidden',
			}
		},
		// Invisible edges
		{
			selector: 'edge[?invisible]',
			style: {
				visibility: 'hidden',
			}
		},
		{
			selector: 'edge[?highlighted]',
			style: {
				width: '10px',
			}
		},
		{
			selector: 'edge[label]',
			style: {
				label: 'data(label)',
				textWrap: 'wrap',
				textBackgroundColor: 'white',
				textBackgroundOpacity: '1.0',
				textBackgroundPadding: '2px',
				//fontSize: props.nodeSize / FONT_SIZE_DIVISOR + 'px',
				textBorderOpacity: '1.0',
				textBorderStyle: 'solid',
				textBorderWidth: '1px',
				textBorderColor: 'black',
			}
		},
		// Directed edges
		{
			selector: 'edge.directed',
			style: {
				targetArrowShape: 'triangle',
			}
		},
    ];

    for (const mapping of dataMappings) {
        styleSheet.push(createCSSRuleFromDataMapping(mapping))
    }



    return styleSheet;
}
