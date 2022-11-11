async function build() {
    const row_nodes = await d3.csv("data/row_nodes.csv");
    const col_nodes = await d3.csv("data/col_nodes.csv");
    const edges = await d3.csv("data/edges.csv");
    function adjacencyMatrix(row_nodes, col_nodes, edges) {
        var matrix = [];
        var edgeHash = {};
        edges.forEach(edge => {
            var id = edge.source + "-" + edge.target;
            edgeHash[id] = edge;
        })
        for (let i = 0; i < row_nodes.length; i++) {
            for (let j = 0; j < col_nodes.length; j++) {
                var uel = row_nodes[i];
                var bel = col_nodes[j];
                var grid = {
                    id: uel.id + "-" + bel.id,
                    x: j,
                    y: i,
                    weight: 0
                }
                if (edgeHash[grid.id]) {
                    grid.weight = edgeHash[grid.id].weight;
                }
                matrix.push(grid);

            }
        }
        return matrix;
    }

    var dimension = {
        width: window.innerWidth * 0.8,
        height: window.innerWidth * 0.8,
        margin: {
            top: 250,
            right: 10,
            bottom: 10,
            left: 255
        }
    }

    dimension.boundedWidth = dimension.width
        - dimension.margin.right
        - dimension.margin.left;

    dimension.boundedHeight = dimension.height
        - dimension.margin.top
        - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimension.margin.left}px,${dimension.margin.top}px)`);
    var data = adjacencyMatrix(row_nodes, col_nodes, edges);
    // console.log(adjacencyMatrix(nodes,edges));
    const pole = bounds
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "grid")
        .attr("width", 25)
        .attr("height", 25)
        .attr("x", d => d.x * 25)
        .attr("y", d => d.y * 25)
        .style("fill-opacity", d => d.weight * 0.2)

    const namesX = wrapper
        .append("g")
        .attr("transform", "translate(255,225)")
        .selectAll("text")
        .data(col_nodes)
        .enter()
        .append("text")
        .attr("y", (d, i) => i * 25 + 12.5)
        .text(d => d.id)
        .style("text-anchor", "start")
        .attr("transform", "rotate(270)");

    const namesY = wrapper
        .append("g")
        .attr("transform", "translate(245,250)")
        .selectAll("text")
        .data(row_nodes)
        .enter()
        .append("text")
        .attr("y", (d, i) => i * 25 + 12.5)
        .text(d => d.id)
        .style("text-anchor", "end");

}

build();