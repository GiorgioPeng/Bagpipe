import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { BaseTable } from 'ali-react-table'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import embed from 'vega-embed';


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '20px',
        padding: '5px',
        backgroundColor:'#edf2fb'
    },
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
}));

const ClusterBoard = (props) => {
    const { relativeArr } = props
    const chartRef = React.useRef()
    const classes = useStyles()
    React.useEffect(() => {
        const tree = {
            nodes: [],
            edges: []
        }
        relativeArr.forEach((element, index, array) => {
            if (Math.abs(element.pearsonCoefficient) > 0.4) {
                tree.edges.push({
                    "source": 0,
                    "target": index + 1,
                    "value": element.pearsonCoefficient === 0 ? 0 : 1 / element.pearsonCoefficient,
                    "inCutEdge": Math.abs(element.pearsonCoefficient) > 0.7 ? true : false
                })
            }
            if (index === 0) {
                tree.nodes.push(
                    {
                        "name": element.column1,
                        "index": 0,
                        "value": 1,
                        'group': 0
                    })
            }
            tree.nodes.push(
                {
                    "name": element.column2,
                    "index": index + 1,
                    "value": 1,
                    'group': index + 1
                })
        })
        if (chartRef.current && relativeArr.length !== 0) {
            embed(chartRef.current, {
                // "$schema": "https://vega.github.io/schema/vega/v5.json",
                "$schema": process.env.PUBLIC_URL + "/schema/vega/v5.json",
                "width": 600,
                "height": 400,
                "padding": 5,
                "autosize": "fit",

                "signals": [
                    { "name": "cx", "update": "width / 2" },
                    { "name": "cy", "update": "height / 2" },
                    {
                        "description": "State variable for active node fix status.",
                        "name": "fix", "value": false,
                        "on": [
                            {
                                "events": "text:mouseout[!event.buttons], window:mouseup",
                                "update": "false"
                            },
                            {
                                "events": "text:mouseover",
                                "update": "fix || true"
                            },
                            {
                                "events": "[text:mousedown, window:mouseup] > window:mousemove!",
                                "update": "xy()",
                                "force": true
                            }
                        ]
                    },
                    {
                        "description": "Graph node most recently interacted with.",
                        "name": "node", "value": null,
                        "on": [
                            {
                                "events": "text:mouseover",
                                "update": "fix === true ? item() : node"
                            }
                        ]
                    },
                    {
                        "description": "Flag to restart Force simulation upon data changes.",
                        "name": "restart", "value": false,
                        "on": [
                            { "events": { "signal": "fix" }, "update": "fix && fix.length" }
                        ]
                    }
                ],

                "data": [
                    {
                        "name": "node-data",
                        values: tree.nodes,
                    },
                    {
                        "name": "link-data",
                        values: tree.edges
                    }
                ],

                "scales": [
                    {
                        "name": "color",
                        "type": "ordinal",
                        "domain": { "data": "node-data", "field": "group" },
                        "range": { "scheme": "redpurple" }
                    },
                    {
                        "name": "colorEdge",
                        "type": "quantize",
                        "domain": { "data": "link-data", "field": "value" },
                        "range": { "scheme": "viridis" }
                    }
                ],

                "marks": [
                    {
                        "name": "nodes",
                        "type": "text",
                        "zindex": 1,

                        "from": { "data": "node-data" },
                        "on": [
                            {
                                "trigger": "fix",
                                "modify": "node",
                                "values": "fix === true ? {fx: node.x, fy: node.y} : {fx: fix[0], fy: fix[1]}"
                            },
                            {
                                "trigger": "!fix",
                                "modify": "node", "values": "{fx: null, fy: null}"
                            }
                        ],

                        "encode": {
                            "enter": {
                                "fill": { "scale": "color", "field": "group" },
                                "text": { "field": "name" },
                                "fontSize": { "value": 16 },
                                "fontWeight": { "value": 600 }
                            },
                            "update": {
                                "cursor": { "value": "pointer" }
                            }
                        },

                        "transform": [
                            {
                                "type": "force",
                                "iterations": 300,
                                "restart": { "signal": "restart" },
                                "signal": "force",
                                "forces": [
                                    { "force": "center", "x": { "signal": "cx" }, "y": { "signal": "cy" } },
                                    { "force": "collide" },
                                    { "force": "nbody" },
                                    { "force": "link", "links": "link-data" }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "path",
                        "from": { "data": "link-data" },
                        "interactive": false,
                        "encode": {
                            "update": {
                                "stroke": {
                                    "scale": "colorEdge",
                                    "field": "value"
                                },
                                "strokeWidth": { "value": 1 },
                                "opacity": { "value": 0.9 }
                            },
                        },
                        "transform": [
                            {
                                "type": "linkpath",
                                "require": { "signal": "force" },
                                "shape": "line",
                                "sourceX": "datum.source.x", "sourceY": "datum.source.y",
                                "targetX": "datum.target.x", "targetY": "datum.target.y"
                            }
                        ]
                    }
                ]
            })
        }
    }, [relativeArr])
    return (
        <>
            {relativeArr.length !== 0 ?
                <Paper elevation={3} className={classes.root}>
                    <Typography variant={'subtitle2'} color="textSecondary" style={{ textAlign: 'center' }}>Correlation Between Each Feature and Output</Typography>
                    <div className={classes.container}>
                        <div ref={chartRef} />
                        <BaseTable
                            style={{ maxWidth: 300, maxHeight: 400, overflow: 'auto' }}
                            dataSource={relativeArr}
                            columns={[
                                {
                                    code: 'column1', width: 100, name: 'column 1'
                                },
                                {
                                    code: 'column2', width: 100, name: 'column 2'
                                },
                                {
                                    code: 'pearsonCoefficient', width: 100, name: 'relative coefficient'
                                },
                            ]}
                        />
                    </div>
                </Paper >
                :
                ''
            }
        </>
    )
}

export default ClusterBoard;