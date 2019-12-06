console.log("Helloooooo");

function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metaData = d3.select("#sample-metadata"); 
      // Use `.html("") to clear any existing metadata
    metaData.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
    
    Object.entries(data).forEach(([key,value]) => {
      metaData.append("h6").text(`${key}: ${value}`);
        console.log(key, value);
        });
      });
  };

  function buildCharts(sample) {
    // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${sample}`).then((data) => {
      const otu_ids = data.otu_ids;
      const sample_values = data.sample_values;
      const otu_labels = data.otu_labels;
      //format data is returned in from app.py:
    //   data = {
    //     "otu_ids": sample_data.otu_id.values.tolist(),
    //     "sample_values": sample_data[sample].values.tolist(),
    //     "otu_labels": sample_data.otu_label.tolist(),
      // @TODO: Build a Bubble Char t using the sample data
      var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values, 
          colorscale: 'YIGnBu' 
        }
      };
      // 'YIGnBu' 
      var data = [trace1];
      
      var layout = {
        title: 'Marker Size',
        showlegend: false,
        margin: { t: 0 },
        xaxis: { title: "OTU ID"},
        yaxis: { title: "Sample Values"}
      };
  
      Plotly.plot("bubble", data, layout);
  
      // @TODO: Build a Pie Chart
      var trace2 = {
        labels: otu_ids.slice(0,10),
        values: sample_values.slice(0,10),
        hovertext: otu_labels.slice(0,10),
        name: "Pie-Chart",
        type: 'pie'
        };
      
      var pieChart = [trace2];   
  
      var pieLayout = {
        title: "Pie Chart",
        margin: { t: 0, l: 0 } };
  
      Plotly.plot("pie", pieChart, pieLayout);
    });
  };
  
  

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector        //.html("");///TESTING, was originally just selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Initialize the dashboard
init();

