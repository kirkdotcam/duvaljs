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

let zonepoints = d3.json('./pentagonreverse.json')
  .then((res) => {
    drawZones(res)
  });


drawFrame();

function drawFrame() {

  let segments = d3.range(numSides)
    .map(i => {

      let angle = i / numSides * (Math.PI * 2) + Math.PI;

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
    zoneSet[key] = zoneSet[key].map(point => {
      return [
        point.x * (radius / maxGasScale) + centerX,
        -point.y * (radius / maxGasScale) + centerY
      ]
    })

    svg.append("path")
      .attr("d", lineFunction(zoneSet[key]))
      .attr("stroke", "green")
      .attr("stroke-width", 1.5)
      .attr("fill", "none");

    globalPoints[key] = zoneSet[key];

  }

}

function drawPoint() {

}

function calcCentroid() {

}

let newpoints = []

// //transform zonepoints
// zonepoints.then(() => {

//   newpoints = Object.values(globalPoints).map((shape) => {
//     return shape.map((point) => {
//       return Object.values(point)
//     })
//   })

//   newpoints = newpoints.map((shape)=>{

//     return shape.map(point=>{
//       return [
//         point[0] * (radius/maxGasScale) + centerX,
//         -point[1] * (radius/maxGasScale) + centerY
//       ]
//     })

//   })
//   console.log(newpoints)


//need to convert pixels of click back to area of pentagon, or areas of pentagon to click
d3.select('svg').on('click', () => {
  let { x, y } = d3.event
  console.clear()
  console.log(x,y);
  console.log(Object.entries(globalPoints))
  Object.entries(globalPoints).forEach((zone) => {
    console.log(zone[0], d3.polygonContains(zone[1], [x, y])) //polygoncontains broken due to change of coordinate system
  })
})

svg.append('line')
  .attr('x1', _ => 20)
  .attr('y1', _ => 20)
  .attr('x2', _ => 250)
  .attr('y2', _ => 250)
  .attr('stroke', 'red')
  .attr('stroke-width', 3);

// https://bl.ocks.org/curran/8b4b7791fc25cfd2c459e74f3d0423f2

