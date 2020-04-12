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
let frameAngles = {};
let zonepoints = d3.json('./pentagonreverse.json')
  .then((res) => {
    drawZones(res)
  });
let gasNames = ["hydrogen","ethane","methane","ethene","ethyne"]


drawFrame();

function drawFrame() {

  let segments = d3.range(numSides)
    .map(i => {

      let angle = i / numSides * (Math.PI * 2) + Math.PI;

      frameAngles[gasNames[i]] = angle; 

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
      return scaleCoordToPixels(point.x, point.y)
    })

    svg.append("path")
      .attr("d", lineFunction(globalPoints[key]))
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr("fill", "none");

  }

}

function extractCoordinate(target, coordinateList){
  const targetObject = coordinateList.find( ({gas}) => gas===target);  
  return [targetObject.x,targetObject.y]
}

function scaleCoordToPixels(x,y){
  return [x * (radius/maxGasScale) + centerX, -1 * y * (radius/maxGasScale) + centerY]
}

function drawPoint(x,y,color) {  
  svg.append("circle")
    .attr("stroke",color? color:"black")
    .attr("cx",x)
    .attr("cy",y)
    .attr("r",1.5);
}

function gasPercentToCoordinate(percentAngleObject){

  let y = -1 * (percentAngleObject.r) * Math.cos(percentAngleObject.angle);
  let x = (percentAngleObject.r) * Math.cos((Math.PI/2)-percentAngleObject.angle);

  // ONLY RETURN THE coordinates of the non-scaled plot here

  drawPoint(...scaleCoordToPixels(x,y),"red"); //looks gross, may remove
  
  
  return {
    x,
    y,
    ...percentAngleObject
  };

}

function calcCentroid(gasPercentArray) {
  
  // calc surface area
  let coordObjList = Object.values(gasPercentArray).map((curr,idx)=>{
    return {
      r:curr.value,
      angle:frameAngles[curr.gas],
      gas:curr.gas
    }
  }).map(curr => gasPercentToCoordinate(curr));
  
  //surface area broken because order wasn't preserved in map of coordinates

  let surfaceArea = (1/2) * gasNames.reduce((acc,curr,idx,src)=>{
    
    let [x1,y1] = extractCoordinate(curr,coordObjList);
    let nextRef = idx === src.length-1 ? 0 : idx+1;
    let [x2,y2] = extractCoordinate(src[nextRef],coordObjList);
    
    return acc + parseFloat(x1*y2 - x2*y1)

  },0);

  const cx = (1/(6*surfaceArea)) * gasNames.reduce((acc,curr,idx,src)=>{
    let [x1,y1] = extractCoordinate(curr,coordObjList);
    let nextRef = idx === src.length-1 ? 0 : idx+1;
    let [x2,y2] = extractCoordinate(src[nextRef],coordObjList);

    let summand = (x1+x2)*(x1*y2 - x2*y1);
    return acc + summand;
  },0)

  const cy = (1/(6*surfaceArea)) * gasNames.reduce((acc,curr,idx,src)=>{
    let [x1,y1] = extractCoordinate(curr,coordObjList);
    let nextRef = idx === src.length-1 ? 0 : idx+1;
    let [x2,y2] = extractCoordinate(src[nextRef],coordObjList);

    let summand = (y1+y2)*(x1*y2 - x2*y1);
    
    return acc + summand;
  },0)
  
  
  return scaleCoordToPixels(cx, cy);

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

  d3.selectAll("input").each((d,i,nodes)=>{
    values.push({
      "value":nodes[i].value,
      "gas":nodes[i].name
    })
  })
  let centroid = calcCentroid(values);
  
  determineZone(...centroid);
  drawPoint(...centroid);
}

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

