let svg = d3.select('body')
  .append('svg')
  .attr("width", 300)
  .attr("height", 300);

let width = svg.attr('width');
let height = svg.attr('height');
let centerX = width / 2;
let centerY = height / 2;
let numSides = 5;
let radius = height / 3;
let globalPoints = {};

let zonepoints = d3.json('./pentagonbasic.json')
  .then((res)=>{
    globalPoints = res
    drawZones(res)
  });


drawFrame();

function drawFrame(){

  let segments = d3.range(numSides)
  .map(i => {
    let angle = i / numSides * (Math.PI * 2) + Math.PI;
    return [
      Math.sin(angle) * radius + centerX,
      Math.cos(angle) * radius + centerY
    ]
    ;
  });

  segments.push(segments[0]);
  
  let lineFunction = d3.line()
    .x(d=>d[0])
    .y(d=>d[1]);

  svg.append("path")
    .attr("d", lineFunction(segments))
    .attr("stroke","blue")
    .attr("stroke-width", 3)
    .attr("fill", "none");
}

function drawZones(zone){
  console.log(zone);
  console.log(radius)
  let lineFunction = d3.line()
    .x(d=> d.x* 2.5 +centerX) // need to scale the x and y values up to the radius of the frame
    .y(d=>-2.5*d.y+centerY);

  for (const key in zone) {
    svg.append("path")
    .attr("d", lineFunction(zone[key]))
    .attr("stroke","black")
    .attr("stroke-width", 3)
    .attr("fill", "none");
  }
}

function drawPoint(){

}
let newpoints = []
//transform zonepoints
zonepoints.then(()=>{
  newpoints = Object.values(globalPoints).map((shape)=>{
    return Object.values(shape).map((point)=>{
      return Object.values(point)
    })
  })

  newpoints.forEach((shape)=>{
    shape.push(shape[0]);
  })

  console.log(newpoints)
})

d3.select('svg').on('click',()=>{
  let {x,y} = d3.event
  console.log([x-centerX,y-centerY])//need to SCALE UP THE NEWPOINTS FOR THE CLICK LOCATION
  newpoints.forEach((zone)=>{
    console.log(d3.polygonContains(zone,[x-centerX,y-centerY]))
  })
})

svg.append('line')
  .attr('x1', _ => 20)
  .attr('y1', _ => 20)
  .attr('x2', _ => 200)
  .attr('y2', _=> 200)
  .attr('stroke','red')
  .attr('stroke-width',3);
// https://bl.ocks.org/curran/8b4b7791fc25cfd2c459e74f3d0423f2

