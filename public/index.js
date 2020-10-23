
// Enter url of your cities Open-Data-Portal here
const city_open_data_prefix = 'https://opendata.stadt-muenster.de/dataset/';

// You don't need to change below here
const open_nrw_prefix = 'https://open.nrw/api/3/action/package_show?id=';
const json_url = 'city_data.json';
var city_data = {};

function showMusterdatenkatalog() {

    $.getJSON('musterdatenkatalog.json', function(musterkatalog) { 

        // Aggregate data into a better structure to print the HTML table based on "Thema"
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
         * Print Musterdatenkatalog HTML table - one nasty loop does it all (O_o)
         */
        var $table = $('<table class="prettyTable"/>');
        $table.append( '<tr><th>Thema</th><th>Bereich</th><th>Datensätze</th><th>Quelle(n)</th></tr>' );
        Object.entries(table).forEach(([topic, subtopics]) => {
            const colspan = Object.keys(subtopics).length +1;
            $table.append('<tr><td rowspan="'+colspan+'">' + topic + '</td>');
            var counter = 0;

            Object.entries(subtopics).forEach(([subtopic, cities]) => {

                // Display the other cities that have this dataset
                const number_of_cities = Object.keys(cities).length;
                var citylist_html = '';
                Object.entries(cities).forEach(([city, content]) => {
                    citylist_html += '<b>' + city + '</b>: '
                        + '<a target="_blank" href="' + open_nrw_prefix + content[0]+'">'+content[1]+'</a><br />';
                });

                // Display the departments of Münster (if we have a matching dataset)
                const taxonomy = topic + ' - ' + subtopic;
                var our_city_html = '';
                if (city_data[taxonomy]) {
                    var our_city_datasets = '';
                    Object.entries(city_data[taxonomy]).forEach(([department, datasets]) => {     
                        our_city_html += department;
                        datasets.forEach(function(dataset){
                            our_city_datasets += '<br /><b>&gt;</b> <a target="_blank" href="' + city_open_data_prefix + dataset + '">' + dataset + '</a>';
                        });
                    });
                    our_city_html += our_city_datasets;
                }

                // Now render the table row
                const tdClass =(our_city_html? ' class="gotIt"' : '');
                $table.append( ((counter++==0)?'':'<tr>')
                    + '<td' + tdClass +  '>' + subtopic + '</td>'
                    + '<td' + tdClass +  '><div class="toggle">' 
                        + (number_of_cities>1? '<i>' + '✪'.repeat(number_of_cities) + '</i><br />' : '')
                        + citylist_html + '</div></td>' 
                    + '<td' + tdClass +  '><div class="toggle">'+our_city_html+'</div></td></tr>');
            });
        });
        $('#musterdatenkatalog').append($table);

        // Onclick table cell expander toggle
        $('.prettyTable div.toggle').click(function(e) {
            $(this).toggleClass('open');
        })
    }); 
}


$(function(){
    /**
     * Try to load city data and convert it to dictionary
     * 
     * input format: 
        cat: 	"Wahlen - Kommunalwahl"
        org: 	"Amt für Bürger- und Ratsservice"
        name:	"kommunalwahl-münster-2020-stichwahl-des-oberbürgermeisters"
        id: 	"29a3d573-98e1-412c-af0c-c356a07eff7b"
     */
    $.ajax({
        url: json_url,
        type: "GET",
        statusCode: {
            404: function() {
                alert('Could not load city data from file "' +json_url+ '". Showing default Musterdatenkatalog')
                showMusterdatenkatalog();
            }
        },
        success:function(json) {
            city_data = {};
            Object.entries(json).forEach(([key, content]) => {
                const taxonomy = content['cat'];
                const org = content['org'];
                const dataset = content['name'];
                if (!city_data[taxonomy]) {
                    city_data[taxonomy] = {};
                }
                if (!city_data[taxonomy][org]) {
                    city_data[taxonomy][org] = [];
                }
                city_data[taxonomy][org].push(dataset);
            });            

            console.log("Got city data", city_data);
            showMusterdatenkatalog();
        }
    });

});