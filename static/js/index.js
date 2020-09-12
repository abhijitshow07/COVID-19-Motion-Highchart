$(function () {
	$.ajax({
        url: "/world_time_series",
        type: 'GET',
        dataType: 'json', // added data type
        success: function(response) {
    	console.log(response)
        motion_chart(response)
    }
});
});
function motion_chart(response){

    header = document.getElementById('header');
    header.innerHTML = "COVID-19 MOTION";
	input = document.getElementById('play-range')
	output = document.getElementById('play-output')

	input.max = parseInt(response.length-1);
	output.innerHTML = response[response.length-1]["name"]

	var chart, dataSequence = response;

    	chart = Highcharts.mapChart('motion', {
                chart: {
                    map: 'custom/world',
                },

                title: {
                    text: 'Total Number of Coronavirus Cases by Country'
                },
                subtitle: {
                    text: 'Source: <a href="https://github.com/CSSEGISandData/COVID-19">Johns Hopkins CSSE</a>'
                },
                legend: {
                    title: {
                        text: 'Total Number of Cases',
                        style: {
                            color: ( // theme
                                Highcharts.defaultOptions &&
                                Highcharts.defaultOptions.legend &&
                                Highcharts.defaultOptions.legend.title &&
                                Highcharts.defaultOptions.legend.title.style &&
                                Highcharts.defaultOptions.legend.title.style.color
                            ) || 'black'
                        }
                    }
                },

                mapNavigation: {
                    enabled: true
                },

                tooltip: {
                    backgroundColor: 'none',
                    borderWidth: 0,
                    shadow: false,
                    useHTML: true,
                    padding: 0,
                    pointFormat: '<span class="f32"><span class="flag {point.properties.hc-key}">' +
                        '</span></span> {point.name}<br>' +
                        '<span style="font-size:30px">{point.value}</span>',
                    positioner: function() {
                        return {
                            x: 80,
                            y: 450
                        };
                    }
                },

                colorAxis: {
                    min: 1,
                    max: 10000000,
                    type: 'logarithmic'
                },

                series: [{
                    data: dataSequence[response.length-1]["data"].slice(),
                    joinBy: ['iso-a3', 'code3'],
                    animation: true,
                    name: 'Number of Cases',
                    states: {
                        hover: {
                            color: '#a4edba'
                        }
                    }
                }]
            });

    
		/**
     * Update the chart. This happens either on updating (moving) the range input,
     * or from a timer when the timeline is playing.
     */
    function update(increment) {
        var input = $('#play-range')[0],
            output = $('#play-output')[0];

        if (increment) {
            input.value = parseInt(input.value) + increment;
        }
        chart.series[0].setData(dataSequence[input.value].data); // Increment dataset (updates chart)
        output.innerHTML = dataSequence[input.value].name; // Output value
        if (parseInt(input.value) >= parseInt(input.max)) { // Auto-pause
            pause($('#play-pause-button')[0]);
        }
    }

    /**
     * Play the timeline.
     */
    function play(button) {
        button.title = 'pause';
        button.className = 'fa fa-pause';
        chart.sequenceTimer = setInterval ( function () {
            update(1);
        }, 250)  
        var input = $('#play-range')[0]
        if(input.value == dataSequence.length-1)
        {
        	input.value = 0
        }
    }
    
    /** 
     * Pause the timeline, either when the range is ended, or when clicking the pause button.
     * Pausing stops the timer and resets the button to play mode.
     */
    function pause(button) {
        button.title = 'play';
        button.className = 'fa fa-play';
        clearTimeout(chart.sequenceTimer);
        chart.sequenceTimer = undefined;
    }
    
    /**
     * Toggle play and pause from the button
     */
    $('#play-pause-button').bind('click', function () {
        if (chart.sequenceTimer === undefined) {
            play(this);
        } 
        else {
            pause(this);
        }
    });
    
    /**
     * Update the chart when the input is changed
     */
    $('#play-range').bind('input', function () {
        update();
    });
}

Highcharts.setOptions({
    lang: {
        thousandsSep: ','
    }
});