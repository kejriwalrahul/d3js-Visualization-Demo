// function startplot(){
var scalefactor = 0.83;

var div = d3.select("body").append("div")	
		    .attr("class", "tooltip")				
			.style("opacity", 0);

var indata1;
var indata2;
var plotMap = function(idata){
	var indata = idata;
	var plot = function(id, filler, mouseover, v1,v2,v3, t1, t2){
		var w = scalefactor*600;
		var h = scalefactor*600;
		var proj = d3.geo.mercator();
		var path = d3.geo.path().projection(proj);
		var t = proj.translate(); 	// the projection's default translation
		var s = proj.scale() 		// the projection's default scale

		var map = d3.select("#" + id).append("svg:svg")
		    .attr("width", w)
		    .attr("height", h)
		    .call(initialize);

		var india = map.append("svg:g");

		d3.json("states.json", function(json) {
		  india.selectAll("path")
		      .data(json.features)
		    .enter().append("path")
		      .attr("d", path)
		      .attr("stroke", "white")
		      .attr("stroke-width", "1")
		      .attr("fill", filler)
		      .on('mouseover', mouseover)
		      .on('mouseout', function(d,i){
		      		d3.select(this).attr('opacity', '1');
		      		div .transition()		
		                .duration(500)		
		                .style("opacity", 0);	
		      })
		      /*.append("title").html(function(d,i){
			      	return d.id;
		      })*/;
		});

		varstops = map.append("defs").append("linearGradient");
		varstops.attr("id", "linear"+id)
			.attr("x1", "0%")
			.attr("x2", "0%")
			.attr("y1", "0%")
			.attr("y1", "100%");
			
		varstops.append("stop").attr("offset", '0%').attr("stop-color",  v1);
		varstops.append("stop").attr("offset", '25%').attr("stop-color", v2);
		varstops.append("stop").attr("offset", '100%').attr("stop-color",v3);

		map.append("rect")
		   .attr("x", w-70)
		   .attr("y", h-110)
		   .attr("height", "90")
		   .attr("width", 30)
		   .attr("fill", "url(#linear"+id+")");

		map .append("text")
			.attr("x", w-70)
			.attr("y", h-115)
			.html(t1);

		map .append("text")
			.attr("x", w-70)
			.attr("y", h-5)
			.html(t2);

		function initialize() {
		  proj.scale(scalefactor*6700);
		  proj.translate([scalefactor*-1240, scalefactor*720]);
		}	
	}	
	return plot;
}


d3.json("litrate.json", function(json){
	indata1 = json;
});
var literacyMap = plotMap(indata1);
literacyMap("chart", function(d,i){
	return "rgb(" + (255-Math.floor(indata1[d.id]-60)*6) + ","+ (255-Math.floor(indata1[d.id]-60)*6) + ",0)"
},function(d,i){
	d3.select(this).attr('opacity', '0.5');
	div .transition().duration(200).style("opacity", .9);		
	div	.html(d.id+": "+indata1[d.id] + "%").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");	
},"rgb(15,15,0)","rgb(75,75,0)","rgb(255,255,0)", "60%", "100%");

var indata2;
d3.json("newgdprate.json", function(json){
	indata2 = json;
});
var sdpMap = plotMap(indata2);
sdpMap("chart2", function(d,i){
	return "rgb("+(255-Math.floor(parseFloat(indata2[d.id]).toFixed(2)/50))+"," + (255-Math.floor(parseFloat(indata2[d.id]).toFixed(2)/50)) + ",0)"
},function(d,i){
	d3.select(this).attr('opacity', '0.5');
	div .transition().duration(200).style("opacity", .9);		
	div	.html(d.id+": "+parseFloat(indata2[d.id]).toFixed(0)*10).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");	
},"rgb(0,0,0)","rgb(64,64,0)","rgb(255,255,0)", "0", "255000");
