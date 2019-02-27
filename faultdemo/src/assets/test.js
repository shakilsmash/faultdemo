var timeFormat = 'DD/MM/YYYY hh:mm:ss a';

var config = {
    type:    'line',
    data:    {
        datasets: [
            {
                label: "US Dates",
                data: [{
                    x: "04/01/2014 11:20:01 AM", y: 1
                }, {
                    x: "04/01/2014 11:30:01 AM", y: 1
                }],
                fill: false,
                borderColor: 'red'
            },
            {
                label: "UK Dates",
                data: [{
                    x: "04/01/2014 11:35:01 AM", y: 1
                }, {
                    x: "04/01/2014 12:15:01 PM", y: 1
                }],
                fill: false,
                borderColor: 'blue'
            }
        ]
    },
    options: {
        responsive: true,
        title:      {
            display: true,
            text:    "Chart.js Time Scale"
        },
        scales:     {
            xAxes: [{
                type:       "time",
                time:       {
                    format: timeFormat,
                    tooltipFormat: 'll',
                    displayFormats: {
                        second: 'h:mm:ss a'
                    },
                distribution: 'linear'
                },
                scaleLabel: {
                    display:     true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                display: false,
                scaleLabel: {
                    display:     true,
                    labelString: 'value'
                }
            }]
        },
        hover: {
            mode: 'nearest',
            intersect: false //true
        },
        tooltips: {
            //Following three lines are defaults
            // mode: 'nearest', //index
            // intersect: false,
            // mode: 'index',

            //Starts the custom thingy
            intersect: false,
            enabled: false,
            custom: function(tooltipModel) {
                // Tooltip Element
                var tooltipEl = document.getElementById('chartjs-tooltip');

                // Create element on first render
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = "<table></table>";
                    document.body.appendChild(tooltipEl);
                }

                // Hide if no tooltip
                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = '0';
                    return;
                }

                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                    tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }

                function getBody(bodyItem) {
                    return bodyItem.lines;
                }

                // Set Text
                if (tooltipModel.body) {
                    var titleLines = tooltipModel.title || [];
                    var bodyLines = tooltipModel.body.map(getBody);
                    //var innerHtml = '<thead>'
                    var innerHtml = '<tbody>'
                    titleLines.forEach(function(title) {
                    //innerHtml += '<tr><th>' + title + '</th></tr>';
                            innerHtml +='<tr><td>Start:</td><td bgcolor="#bababa"> Sun 1 Jul 2018 at ' + title + ' GMD+8</td></tr>' + 
                                        '<tr><td>End:</td><td> Sun 1 Jul 2018 18:32:03 GMD+8</td></tr>' + 
                                        '<tr><td>Length:</td><td>00:05:45</td></tr>' + 
                                        '<tr><td>Keywords:</td><td>works, yay, best</td></tr>'
                                    ;
                    });
                    innerHtml += '</tbody>';
                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }

                // `this` will be the overall tooltip
                var position = this._chart.canvas.getBoundingClientRect();

                // Display, position, and set styles for font
                tooltipEl.style.opacity = '1';
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                tooltipEl.style.pointerEvents = 'none';
            }
        }
    }
};

window.onload = function () {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);
};