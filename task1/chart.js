async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const xAccessor = (d) => dateParser(d.date);
    const hAccessor = (d) => d.temperatureHigh;  //ADDED NEW VARIABLE
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
            top: 23,
            left: 23,
            bottom: 23,
            right: 23
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg");

    svg.attr("height", dimension.height);
    svg.attr("width", dimension.width);
    svg.append("text")
        .attr("x", dimension.width / 2)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Weather chart");

    svg.append("text")
        .attr("x", dimension.width / 2)
        .attr("y", dimension.height)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Date");
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(dimension.height / 2))
        .attr("y", 15)
        .style("text-anchor", "middle")
        .text("Degree");
    const bounded = svg.append("g");

    bounded.style("transform", `translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([dimension.boundedHeight, 0]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimension.boundedWidth]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    var x_axis = d3.axisBottom()
        .scale(xScaler);

    var y_axis = d3.axisLeft()
        .scale(yScaler);

    bounded.append("path")
        .attr("d", lineGenerator(data))
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("transform", "translate(50,10)");

    bounded.append("g")
        .attr("transform", `translate(50,${dimension.boundedHeight})`)
        .call(x_axis);

    bounded.append("g")
        .attr("transform", `translate(50,0)`)
        .call(y_axis);
}

buildPlot();