var slide_number = 0;
var slide_annotation_index = 0;

const NUM_SLIDES = 3;

var data = null;
var svg = d3.selectAll('svg');

const margin = 50;
const height = 600;
const width = 600;

const annotation_type = d3.annotationLabel

const barplot_annotations = 
    [
        [
            {
            note: {
                label: 'Most Houses are Either Located Inland or at least 1 Hour Away from the Ocean',
                title: 'Insight #1',
                wrap: 200
            },
            color: ["black"],
            x: 240,
            y: 100,
            dx: 50,
            dy: 50
            }
        ],
        [
            {
            note: {
                label: 'This data set comprises of houses from California, so there are a sizable amount of houses near oceans.',
                title: 'Insight #2',
                wrap: 200
            },
            color: ["black"],
            x: 350,
            y: 400,
            dx: 50,
            dy: -50
            }
        ]
];

const barplot_median_annotations = 
    [
        [
            {
            note: {
                label: 'Houses not near ocean have a lower median price compared to houses more close to the ocean',
                title: 'Insight #1',
                wrap: 200
            },
            color: ["black"],
            x: 100,
            y: 275,
            dx: 50,
            dy: 50
            }
        ],
        [
            {
            note: {
                label: 'Though Median prices of Homes on Islands are the highest, they are an outlier in the data set.',
                title: 'Insight #2',
                wrap: 200
            },
            color: ["black"],
            x: 350,
            y: 100,
            dx: -50,
            dy: 50
            }
        ]
];

const barplot_median_income_annotations = 
    [
        [
            {
            note: {
                label: 'There exists a correlation between household income and household median home',
                title: 'Insight #1',
                wrap: 200
            },
            color: ["black"],
            x: 100,
            y: 250,
            dx: 50,
            dy: -50
            }
        ],
        [
            {
            note: {
                label: 'Households near oceans will have on median a higher income than their counterparts more inland. Except Islands of course.',
                title: 'Insight #2',
                wrap: 200
            },
            color: ["black"],
            x: 600,
            y: 200,
            dx: -50,
            dy: 50
            }
        ]
];

async function init() {
    console.log("data loading")
    // data = await d3.csv('https://raw.githubusercontent.com/imsatyamshandilya/ML-housing_price_prediction/master/housing.csv');
    barplot_data = await d3.csv('https://raw.githubusercontent.com/domatt1854/housing-data/main/ocean_proximity_counts.csv');
    barplot_data_median = await d3.csv('https://raw.githubusercontent.com/domatt1854/housing-data/main/ocean_proximity_median_value.csv')
    barplot_data_income_median = await d3.csv('https://raw.githubusercontent.com/domatt1854/housing-data/main/ocean_proximity_median_income.csv')
    slide_number = 1;
    await renderBarplot();
    console.log("done");
}

async function renderVisualization(state) {
    slide_annotation_index = 0;

    if( state === 'next') {
        slide_number++;

        if( slide_number > NUM_SLIDES ) {
            slide_number = 3;
        }
    }
    if ( state === 'prev' ) {
        slide_number--;

        if( slide_number < 1 ) {
            slide_number = 1;
        }
    }

    console.log("slide number: " + slide_number);
    d3.selectAll("svg").html("");

    if( slide_number == 1 ) {
        await renderBarplot(0);
    }    
    else if ( slide_number == 2 ) {
        await renderBarPlot3(0);
    }
    else if( slide_number == 3) {
        await renderBarPlot2(0);
    }
}

async function updateAnnotationIndex() { 
    slide_annotation_index++;
    console.log("slide annotation index updated to: " + slide_annotation_index);
    if (slide_number == 1) {
        await renderBarplot(slide_annotation_index);
    }
    else if (slide_number == 2) {
        await renderBarPlot3(slide_annotation_index);
    }
    else if( slide_number == 3) {
        await renderBarPlot2(slide_annotation_index);
    }
}

async function renderBarplot(slide_annotation_index) {
    var x = d3.scaleBand()
        .range([0, width])
        .domain(barplot_data.map(function(d) { return d.ocean_proximity; }));
    
    var y = d3.scaleLinear()
        .domain([0, 8000])
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", "translate(" + margin + ", " + (height - margin) + ")")
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", "translate(" + margin + ", -" + margin + ")")
        .call(d3.axisLeft(y));
    
    svg.selectAll("barplot").data(barplot_data)
        .enter()
        .append("rect")
        .attr("transform", "translate(" + 88 + ", -" + margin + ")")
        .attr("x", function(d) { return x(d.ocean_proximity); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth() - 75)
        .attr("height", function(d) { return height - y(d.count); })
        .attr("fill", "#69b3a2")

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", (margin / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Housing Locations Counts with Respect to Ocean");

    if( slide_annotation_index != 0 && slide_annotation_index < barplot_annotations.length + 1) {

        console.log("slide annotation index: " + slide_annotation_index);
        const annotation = d3.annotation()
            .annotations(barplot_annotations[(slide_annotation_index - 1)]);
        
        console.log(barplot_annotations[(slide_annotation_index - 1)]);

        console.log("annotation updated, accessing: " + (slide_annotation_index - 1));
        svg.append("g")
            .attr("class", "annotation-group")
            .call(annotation);
    }
}

async function renderBarPlot2(slide_annotation_index) {
    var x = d3.scaleBand()
        .range([0, width])
        .domain(barplot_data_income_median.map(function(d) { return d.ocean_proximity; }));
    
    var y = d3.scaleLinear()
        .domain([0, 60000])
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", "translate(" + margin + ", " + (height - margin) + ")")
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", "translate(" + margin + ", -" + margin + ")")
        .call(d3.axisLeft(y));
    
    svg.selectAll("barplot").data(barplot_data_income_median)
        .enter()
        .append("rect")
        .attr("transform", "translate(" + 88 + ", -" + margin + ")")
        .attr("x", function(d) { return x(d.ocean_proximity); })
        .attr("y", function(d) { return y(d.median_income); })
        .attr("width", x.bandwidth() - 75)
        .attr("height", function(d) { return height - y(d.median_income); })
        .attr("fill", "#69b3a2");
    
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", (margin / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Household Median Income According to Their Location W.R.T. the Ocean");
    
    if( slide_annotation_index != 0 && slide_annotation_index < barplot_median_income_annotations.length + 1) {

        console.log("slide annotation index: " + slide_annotation_index);
        const annotation = d3.annotation()
            .annotations(barplot_median_income_annotations[(slide_annotation_index - 1)]);
        
        console.log(barplot_median_income_annotations[(slide_annotation_index - 1)]);

        console.log("annotation updated, accessing: " + (slide_annotation_index - 1));
        svg.append("g")
            .attr("class", "annotation-group")
            .call(annotation);
    }
}

async function renderBarPlot3(slide_annotation_index) {
    var x = d3.scaleBand()
        .range([0, width])
        .domain(barplot_data_median.map(function(d) { return d.ocean_proximity; }));
    
    var y = d3.scaleLinear()
        .domain([0, 500000])
        .range([height, 0]);
    
    svg.append("g")
        .attr("transform", "translate(" + margin + ", " + (height - margin) + ")")
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", "translate(" + margin + ", -" + margin + ")")
        .call(d3.axisLeft(y));
    
    svg.selectAll("barplot").data(barplot_data_median)
        .enter()
        .append("rect")
        .attr("transform", "translate(" + 88 + ", -" + margin + ")")
        .attr("x", function(d) { return x(d.ocean_proximity); })
        .attr("y", function(d) { return y(d.median_house_value); })
        .attr("width", x.bandwidth() - 75)
        .attr("height", function(d) { return height - y(d.median_house_value); })
        .attr("fill", "#69b3a2");
    
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", (margin / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Home Median Prices According to Their Location W.R.T. the Ocean");
    
    if( slide_annotation_index != 0 && slide_annotation_index < barplot_median_annotations.length + 1) {

        console.log("slide annotation index: " + slide_annotation_index);
        const annotation = d3.annotation()
            .annotations(barplot_median_annotations[(slide_annotation_index - 1)]);
        
        console.log(barplot_median_annotations[(slide_annotation_index - 1)]);

        console.log("annotation updated, accessing: " + (slide_annotation_index - 1));
        svg.append("g")
            .attr("class", "annotation-group")
            .call(annotation);
    }
}
