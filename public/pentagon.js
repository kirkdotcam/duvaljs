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

function drawZones(){
  
}

function drawPoint(){}


svg.append('line')
  .attr('x1', _ => 20)
  .attr('y1', _ => 20)
  .attr('x2', _ => 200)
  .attr('y2', _=> 200)
  .attr('stroke','red')
  .attr('stroke-width',3);
// https://bl.ocks.org/curran/8b4b7791fc25cfd2c459e74f3d0423f2

