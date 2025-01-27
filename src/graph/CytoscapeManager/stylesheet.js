const stylesheet = [
    {
        "selector": "node",
        "style": {
            "width": "25px",
            "height": "25px",
            "backgroundColor": "#FFFFFF",
            "color": "#000000",
            "borderWidth": "2.5px",
            "borderStyle": "solid",
            "borderColor": "#AAAAAA",
            "backgroundOpacity": 1,
            "shape": "circle",
            "textValign": "center",
            "visibility": "visible",
            "fontSize": "12.5px"
        }
    },
    {
        "selector": "edge",
        "style": {
            "label": "data(id)",
            "width": 3,
            "lineColor": "#444444",
            "color": "#AA0000",
            "targetArrowColor": "#444444",
            "targetArrowShape": "none",
            "curveStyle": "bezier"
        }
    },
    {
        "selector": "node[?marked]",
        "style": {
            "backgroundColor": "orange"
        }
    },
    {
        "selector": "node[?highlighted]",
        "style": {
            "borderWidth": "5px"
        }
    },
    {
        "selector": "node[?invisible]",
        "style": {
            "visibility": "hidden"
        }
    },
    {
        "selector": "edge[?invisible]",
        "style": {
            "visibility": "hidden"
        }
    },
    {
        "selector": "edge[?highlighted]",
        "style": {
            "width": "10px"
        }
    },
    {
        "selector": "edge[label]",
        "style": {
            "label": "data(label)",
            "textWrap": "wrap",
            "textBackgroundColor": "white",
            "textBackgroundOpacity": "1.0",
            "textBackgroundPadding": "2px",
            "textBorderOpacity": "1.0",
            "textBorderStyle": "solid",
            "textBorderWidth": "1px",
            "textBorderColor": "black"
        }
    },
    {
        "selector": "edge.directed",
        "style": {
            "targetArrowShape": "triangle"
        }
    },
    {
        "selector": "node[color]",
        "style": {
            "backgroundColor": "data(color)"
        }
    },
    {
        "selector": "node[id]",
        "style": {
            "label": "data(id)"
        }
    },
    {
        "selector": "node[shape]",
        "style": {
            "shape": "data(shape)"
        }
    },
    {
        "selector": "node[borderColor]",
        "style": {
            "borderColor": "data(borderColor)"
        }
    },
    {
        "selector": "node[borderWidth]",
        "style": {
            "borderWidth": "data(borderWidth)"
        }
    },
    {
        "selector": "node[backgroundOpacity]",
        "style": {
            "backgroundOpacity": "data(backgroundOpacity)"
        }
    },
    {
        "selector": "node[size]",
        "style": {
            "width": "data(size)",
            "height": "data(size)"
        }
    },
    {
        "selector": "edge[width]",
        "style": {
            "width": "data(width)"
        }
    },
    {
        "selector": "edge[color]",
        "style": {
            "lineColor": "data(color)",
            "targetArrowColor": "data(color)"
        }
    }
];

export default stylesheet;