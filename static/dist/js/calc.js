var width = 1000,
    height = 1000;

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

d3.json("data").then(function(d) {
    var node = chart.selectAll("g")
        .data(d)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(" + ((i * 180) + 50) + ",0)"; });
    
    var rect = node.append("rect")
                .attr("width", 100)
                .attr("height", 100);

    var label = node.append("text")
                .attr("x", 3)
                .attr("y", 12)
                .attr("class", "nodelabel")
                .text(function(d) { return  d.name; });
    
    var inputs_enter = node.selectAll("path.inputs")
        .data(function(d) { return d.inputs.map(function(obj) {
            return {
                input: obj,
                length: d.inputs.length
            }
        })})
        .enter().append("path")
        .attr("d", function(e, i) {
            x_spc = 100 / (e.length + 1);
            i_width = 10;
            return "M0 " + ((i+1)*(x_spc) - (i_width/2)) + " L30 " + ((i+1)*(x_spc) - (i_width/2)) +
                "Q32 " + ((i+1)*(x_spc)) + " 30 " + ((i+1)*(x_spc) + (i_width/2)) + "L0 " + ((i+1)*(x_spc) + (i_width/2));

        });
    
    var inp_text = node.selectAll("text.inputs")
        .data(function(d) { return d.inputs.map(function(obj) {
            return {
                input: obj,
                length: d.inputs.length
            }
        })})
        .enter().append("text")
        .attr("x", "0")
        .attr("y", function(e, i) {
            x_spc = 100 / (e.length+ 1);
            return (i+1)*(x_spc) + 3;
        })
        .text(function(e, i) { 
            return e.input; 
        });
    
    var outputs = node.selectAll("path.outputs")
        .data(function(d) { return d.outputs.map(function(obj) {
            return {
                output: obj,
                length: d.outputs.length
            }
        })})
        .enter().append("path")
        .attr("d", function(e, i) {
            x_spc = 100 / (e.length + 1);
            i_width = 10;
            return "M100 " + ((i+1)*(x_spc) - (i_width/2)) + " L70 " + ((i+1)*(x_spc) - (i_width/2)) +
                "Q68 " + ((i+1)*(x_spc)) + " 70 " + ((i+1)*(x_spc) + (i_width/2)) + "L100 " + ((i+1)*(x_spc) + (i_width/2));
        }).exit();
    
    var out_text = node.selectAll("text.outputs")
        .data(function(d) { return d.outputs.map(function(obj) {
            return {
                output: obj,
                length: d.outputs.length
            }
        })})
        .enter().append("text")
        .attr("x", "70")
        .attr("y", function(e, i) { 
            x_spc = 100 / (e.length+ 1);
            return (i+1)*(x_spc) + 3;
        })
        .text(function(e, i) { 
            return e.output; 
        });

});