


function optionChanged(newSample) {
    console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
}

function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
        });
      buildMetadata(data.metadata[0]["id"]);
      buildCharts(data.metadata[0]["id"]);
  });
  
};

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      let metadata = data.metadata;
      let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
      let PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID: " + result.id);
      PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
      PANEL.append("h6").text("GENDER: "+result.gender);
      PANEL.append("h6").text("AGE: "+result.age);
      PANEL.append("h6").text("BBTYPE: "+result.bbtype);
      PANEL.append("h6").text("LOCATION: "+result.location);
      PANEL.append("h6").text("WFREQ: "+result.wfreq);

      if ((result.wfreq == 0)||(result.wfreq == null)){ 
        console.log("NULL washing freq")
        let PANEL = d3.select("#gauge");
        PANEL.html("");            
        return;
      };      
      var data2 = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: result.wfreq, 
            title: { text: "Washing Frequency" },
            type: "indicator",
            mode: "gauge+number"
        }
     ];
    
     var layout2 = {margin: { t: 0, b: 0 } };
     Plotly.newPlot('gauge', data2, layout2);      
     });
}

function buildCharts(newsample){
    d3.json("samples.json").then((data) => {
        let sample = data.samples;    
        let resultArray = sample.filter(sampleObj => sampleObj.id == newsample);
        
        var tempResult = resultArray[0];

        if (tempResult.otu_ids.length == 0){ 
            console.log("NULL LIST OF BACTERIA")
            let PANEL = d3.select("#bar");
            PANEL.html("");  
            let PANEL1 = d3.select("#bubble");
            PANEL1.html("");                        
            return;
        };

        let i = tempResult.sample_values.length;
        console.log("length: "+i);
        let temp = [];
        for (let j=0;j<i;j++){
            let temp1 = [tempResult.otu_ids[j],tempResult.sample_values[j],tempResult.otu_labels[j]];
            temp.push(temp1);
        };
        
        let sortedSamples = temp.sort((a,b) => a[1] - b[1]).reverse();
        let topTenSamples = sortedSamples.slice(0,10);
        let sortedtopTenSamples = topTenSamples.sort((a,b) => a[1] - b[1]);
        console.log(topTenSamples);
        var plotSamplesX =[]
        var plotSamplesY =[]
        var plotSamplesLabel =[]
        var k = 10
        if (i<k){k = i};
        console.log("k :"+k);

        for (let j=0;j<k;j++){
            plotSamplesX.push(topTenSamples[j][1]);
            plotSamplesY.push("OTU "+topTenSamples[j][0]);
            plotSamplesLabel.push(topTenSamples[j][2]);
        }
        var trace = {
            x: plotSamplesX,
            y: plotSamplesY,
            text : plotSamplesLabel,
            type: "bar",
            orientation : "h"
        };
        var data = [trace];
        var layout = {
            title: "Top Ten(or Max)OTUs",
            yaxis: { title: "OTU id" },
            xaxis: { title: "Sample Values"}
        };
        //let PANEL = d3.select("#bar");
        //PANEL.html("");
        Plotly.newPlot("bar", data, layout);

        var trace1 = {
            x : tempResult.otu_ids,
            y : tempResult.sample_values,
            text : tempResult.otu_labels,
            mode : 'markers',
            marker : {
                size : tempResult.sample_values,
                color : tempResult.otu_ids 
            }
        };
        var data1 = [trace1];
        var layout1 = {
            title : "OTU Bubble Chart",
            xaxis: { title: "OTU id" },
            yaxis: { title: "Sample Values"},            
            //height : 600,
            //width : 800
        };
        Plotly.newPlot("bubble", data1, layout1);
        
    });
};

init();