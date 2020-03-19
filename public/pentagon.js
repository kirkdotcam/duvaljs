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

  // console.log(zoneSet)
  // console.log(globalPoints)

}

function drawPoint(x,y) {
  svg.append("circle")
    .attr("cx",x)
    .attr("cy",y)
    .attr("r",1.5)
}

function calcCentroid(gasPercentArray) {
  // calc surface area
  gasPercentArray.map((curr,idx)=>{
    return {
      r:curr,
      angle:frameAngles[idx]
    }
  }).reduce((acc,curr,idx,src)=>{
    let x1 = curr.r * Math.cos(curr.angle);
    let y1 = curr.r * Math.cos((Math.PI/2)-curr.angle);


    let nextRef = idx === src.length ? 0 : idx+1;

    let x2 = src[nextRef] * Math.cos(curr.angle);
    let y2 = src[nextRef] * Math.cos((Math.PI/2)-curr.angle);

    return acc + (x1*y2 - x2*y1)

  })
  

  // calc x and y

}

function determineZone(x,y) {
  Object.entries(globalPoints).forEach((zone) => {
    if (d3.polygonContains(zone[1], [x, y])){
      console.log(zone[0])
    }
  })
}
function formSubmit(){
  let form = d3.selectAll("input")
  form.each((d,i,nodes)=>{
    console.log(nodes[i].value)
  })

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

