let svg = d3.select('body')
  .append('svg')
  .attr("width", 300)
  .attr("height", 300);

let width = svg.attr('width');
let height = svg.attr('height');
let centerX = width / 2;
let centerY = height / 2;
let numSides = 5;
let radius = height / 4;
let globalPoints = {};
let maxGasScale = 40; //as defined by paper, no gas concentration will likely rise above 40%
let frameAngles = [];
let zonepoints = d3.json('./pentagonreverse.json')
  .then((res) => {
    drawZones(res)
  });


drawFrame();

function drawFrame() {

  let segments = d3.range(numSides)
    .map(i => {

      let angle = i / numSides * (Math.PI * 2) + Math.PI;

      frameAngles.push(angle); 

      return [
        Math.sin(angle) * radius + centerX,
        Math.cos(angle) * radius + centerY
      ];

    });
    console.log(segments);
    
  segments.push(segments[0]);

  let lineFunction = d3.line()
    .x(d => d[0])
    .y(d => d[1]);

  svg.append("path")
    .attr("d", lineFunction(segments))
    .attr("stroke", "blue")
    .attr("stroke-width", 3)
    .attr("fill", "none");
}

function drawZones(zoneSet) {

  let lineFunction = d3.line()
    .x(d => d[0])
    .y(d => d[1]);

  for (const key in zoneSet) {
    globalPoints[key] = zoneSet[key].map(point => {
      return [
        point.x * (radius / maxGasScale) + centerX,
        -1 * point.y * (radius / maxGasScale) + centerY
      ]
    })

    svg.append("path")
      .attr("d", lineFunction(globalPoints[key]))
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr("fill", "none");

  }

}

function drawPoint(x,y,color) {
  svg.append("circle")
    .attr("stroke",color? color:"black")
    .attr("cx",x)
    .attr("cy",y)
    .attr("r",1.5);
}


function gasPercentToCoordinate(percentAngleObject){

  let x = percentAngleObject.r * Math.cos(percentAngleObject.angle);
  let y = percentAngleObject.r * Math.cos((Math.PI/2)-percentAngleObject.angle);

  console.log(percentAngleObject)
  return [x,y];

}

function calcCentroid(gasPercentArray) {
    
  // calc surface area
  let coordinates = Object.values(gasPercentArray).map((curr,idx)=>{
    return {
      r:curr.value,
      angle:frameAngles[idx]
    }
  }).map(curr => gasPercentToCoordinate(curr));
  
  let surfaceArea = (1/2) * coordinates.reduce((acc,curr,idx,src)=>{
    let [x1,y1] = curr
    let nextRef = idx === src.length-1 ? 0 : idx+1;
    let [x2,y2] = src[nextRef];
    
    return acc + parseFloat(x1*y2 - x2*y1)

  },0);


  
  // TODO: radii need to be scaled back to size of plot for these and for surfaceArea. also need to slide final x, y by same as center of frame

  const cx = (1/6*surfaceArea) * coordinates.reduce((acc,curr,idx,src)=>{
    let [x1,y1] = curr;
    let nextRef = idx === src.length-1 ? 0 : idx+1;
    let [x2,y2] = src[nextRef];

    let summand = (x1+x2)*(x1*y2 - x2*y1);
    return acc + summand;
  },0)

  const cy = (1/6*surfaceArea) * coordinates.reduce((acc,curr,idx,src)=>{
    let [x1,y1] = curr;
    let nextRef = idx === src.length-1 ? 0 : idx+1;
    let [x2,y2] = src[nextRef];

    let summand = (y1+y2)*(x1*y2 - x2*y1);
    
    return acc + summand;
  },0)

  return [cx,cy];

}

function determineZone(x,y) {
  Object.entries(globalPoints).forEach((zone) => {
    if (d3.polygonContains(zone[1], [x, y])){
      console.log(zone[0])
    }
  })
}

function formSubmit(){
  let values = [];

  // TODO: push an object with gas ID and value instead
  d3.selectAll("input").each((d,i,nodes)=>{
    values.push({
      "value":nodes[i].value,
      "gas":nodes[i].name
    })
  })
  let centroid = calcCentroid(values);
  
  console.log(centroid);
  
  determineZone(...centroid);
  drawPoint(...centroid);
}

// d3.select('#submission').on('click', () =>{

// })
//need to convert pixels of click back to area of pentagon, or areas of pentagon to click
d3.select('svg').on('mousedown', () => {
  console.clear();

  let { x, y } = d3.event
  determineZone(x,y);
  x = x-10
  y = y-10
  drawPoint(x,y);
})

// https://bl.ocks.org/curran/8b4b7791fc25cfd2c459e74f3d0423f2

