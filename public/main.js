Plotly.d3.json('./duvalzones.json', function(err, rawData) {
    if (err) throw err;
    //console.log(duvalzones)
    plot(duvalzones);
});

function plot(rawData) {
    var data = Object.keys(rawData).map(function(k) {
        var pts = rawData[k];

        return {
            type: 'scatterternary',
            mode: 'lines',
            name: k,
            a: pts.map(function(d) { return d.methane }),
            b: pts.map(function(d) { return d.acetylene }),
            c: pts.map(function(d) { return d.ethylene }),
            line: { color: '#00a' }
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
        annotations: [{
            showarrow: false,
            text: 'Duval Triangle',
            x: 0.15,
            y: 1.1
        },
        {
          showarrow:true,
          text: 'hello world',
          x: 0.80,
          y: 0.48
        }
      ]
    };

    Plotly.plot('graph', data, layout);
}

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
