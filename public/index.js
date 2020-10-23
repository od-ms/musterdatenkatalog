$(function(){

    $.getJSON('musterdatenkatalog.json', function(musterkatalog) { 

        // dkanStats.counts;
        // dkanStats.datasets;
        // dkanStats.groups;
/*
        var dataSource = [];
        var obj = dkanStats.counts

        var keysSorted = Object.keys(obj).sort(function(a,b){return obj[a]-obj[b]})

        keysSorted.forEach(function(prop) {
            dataSource.push({
                source: prop,
                count: obj[prop]
            })
            console.log("o." + prop + " = " + obj[prop]);

        })
        */
/*
        $("#chart1").dxChart({
            dataSource: dataSource, 
            rotated: true,
            legend: {
                position: "inside",
                verticalAlignment: "bottom"
            },
            series: {
                argumentField: "source",
                valueField: "count",
                name: "Anzahl Open-Data-Datensätze",
                type: "bar"
             //   color: '#ffaa66'
            }
        });
*/

        // aggregate data
        var table = {};
        Object.entries(musterkatalog).forEach(([key, value]) => {
            const topic = value['top'];
            const subtopic = value['sub'];
            const city = value['org'];
            const dataset = value['name'];
            const data_id = value['id']
            if (!table[topic]) {
                table[topic] = {};
            }
            if (!table[topic][subtopic]) {
                table[topic][subtopic] = {};
            }
            table[topic][subtopic][city] = [data_id, dataset];
        });
        console.log("table", table);

        /**
         * Print Musterdatenkatalog
         */
       
        var $table = $('<table class="prettyTable"/>');
        $table.append( '<tr><th>Thema</th><th>Bereich</th><th>Datensätze</th>' );
        Object.entries(table).forEach(([topic, subtopics]) => {
            const colspan = Object.keys(subtopics).length +1;
            $table.append('<tr><td rowspan="'+colspan+'">' + topic + '</td>');
            var counter = 0;
            Object.entries(subtopics).forEach(([subtopic, cities]) => {
                const number_of_cities = Object.keys(cities).length;
                var city_html = '';
                Object.entries(cities).forEach(([city, content]) => {
                    city_html += '<b>' + city + '</b>: '
                        + '<a target="_blank" href="https://open.nrw/api/3/action/package_show?id='+content[0]+'">'+content[1]+'</a><br />';
                });
                $table.append( ((counter++==0)?'':'<tr>')
                    + '<td>' + subtopic + '</td>'
                    + '<td><div class="toggle">' 
                        + (number_of_cities>1? '<i>' + '✪'.repeat(number_of_cities) + '</i><br />' : '')
                        + city_html
                        + '</div></td></tr>');
            });
        });
        $('#musterdatenkatalog').append($table); 
        $('.prettyTable div.toggle').click(function(e) {
            $(this).toggleClass('open');
        })

    }); 

});