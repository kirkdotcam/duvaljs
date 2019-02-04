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



drawSegments();


function drawSegments() {
  let segments = d3.range(numSides)
    .map(i => {
      let angle = i / numSides * (Math.PI * 2) + Math.PI;
      return {
        x: Math.sin(angle) * radius + centerX,
        y: Math.cos(angle) * radius + centerY
      };
    })
    .map((value, index, points) => ({
      x1: points[index].x,
      y1: points[index].y,
      x2: points[(index + 1) % numSides].x,
      y2: points[(index + 1) % numSides].y
    }));
  svg.selectAll('line').data(segments)
    .enter().append('line')
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
}

svg.append('line')
  .attr('x1', _ => 20)
  .attr('y1', _ => 20)
  .attr('x2', _ => 200)
  .attr('y2', _=> 200)
  .attr('stroke','red')
  .attr('stroke-width',3);
// https://bl.ocks.org/curran/8b4b7791fc25cfd2c459e74f3d0423f2

