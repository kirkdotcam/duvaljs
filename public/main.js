Plotly.d3.json('./duvalzones.json', function(err, rawData) {
    if (err) throw err;
    plot(rawData);
});

function plot(rawData) {
    var data = Object.keys(rawData).map(function(k) {
        var pts = rawData[k];

        return {
            type: 'scatterternary',
            mode: 'lines+markers',
            name: k,
            a: pts.map(function(d) { return d.methane }),
            b: pts.map(function(d) { return d.acetylene }),
            c: pts.map(function(d) { return d.ethylene }),
            line: { color: '#00a' },
            hoveron:'fills'
        };
    });

    var layout = {
        ternary: {
            sum: 100,
            aaxis: makeAxis('methane'),
            baxis: makeAxis('acetylene'),
            caxis: makeAxis('ethylene')
        },
        showlegend: false,
        width: 700,
        annotations: [
        {
            //plot title
            showarrow: false,
            text: 'Duval Triangle',
            x: 0.15,
            y: 1.1
        },
        {
          //ethylene arrow
          showarrow:true,
          text: '%C2H4',
          x: 0.80,
          y: 0.48,
          ax: -25,
          ay: -35,
          textangle:60
        },
        {
          //acetylene arrow
          showarrow:true,
          text: '%C2H2',
          x: 0.46,
          y: -0.15,
          ax: 40,
          ay: 0
        },
        {
          //methane arrow
          showarrow:true,
          text: '%CH4',
          x: 0.26,
          y: 0.58,
          ax: -25,
          ay: 35,
          textangle:-60
        },
        {
          //d1
          showarrow:false,
          text:"D1",
          font:{size: 20},
          x: 0.38,
          y: 0.38
        },
        {
          //d2
          showarrow:false,
          text:"D2",
          font:{size: 20},
          x: 0.50,
          y: 0.15
        },
        {
          //dt
          showarrow:false,
          text:"DT",
          font:{size: 20},
          x: 0.60,
          y: 0.15
        },
        {
          //t3
          showarrow:false,
          text:"T3",
          font:{size: 20},
          x: 0.72,
          y: 0.15
        },
        {
          //t2
          showarrow:true,
          text:"T2",
          font:{size: 20},
          x: 0.60,
          y: 0.72,
          ax: 25,
          ay: -35
        },
        {
          //t1
          showarrow:true,
          text:"T1",
          font:{size: 20},
          x: 0.55,
          y: 0.86,
          ax: 25,
          ay: -35
        },
        {
          //pd
          showarrow:true,
          text:"PD",
          font:{size: 20},
          x: 0.46,
          y: 1,
          ax: -35,
          ay: 0
        }
      ]
    };

    Plotly.plot('graph', data, layout);
};

function makeAxis(title) {
  return {
      title: title,
      ticksuffix: '%',
      min: 0.01,
      linewidth: 2,
      ticks: 'outside',
      ticklen: 8,
      showgrid: true,
  };
}
