var slide_number = 0;
const NUM_SLIDES = 3;
var data = null;
var svg = d3.selectAll('svg');

const margin = 50;
const height = 600;
const width = 600;

async function init() {
    console.log("data loading")
    data = await d3.csv('https://raw.githubusercontent.com/imsatyamshandilya/ML-housing_price_prediction/master/housing.csv');
    await renderBarplot();
    console.log("done");
}

async function renderVisualization(state) {
    if( state === 'next') {
        slide_number++;

        if( slide_number > NUM_SLIDES ) {
            slide_number = 3;
        }
    }
    if ( state === 'prev' ) {
        slide_number--;

        if( slide_number < 0 ) {
            slide_number = 0;
        }
    }

    if( slide_number == 1 ) {
        await renderBarplot();
    }    
}

async function renderBarplot() {
    var x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function(d) { return d.ocean_proximity; }));
    
    var y = d3.scaleLinear()
        .domain([0, 400000])
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", "translate(" + margin + ", " + (height - margin) + ")")
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", "translate(" + margin + ", -" + margin + ")")
        .call(d3.axisLeft(y));
    
    svg.data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.ocean_proximity); })
        .attr("y". function(d))

}