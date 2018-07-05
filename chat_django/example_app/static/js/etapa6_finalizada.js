$.fn.grafico = function(options) {
    var container = this, 
        settings = $.extend({
            title: '',
            status: {
                nao_resp: 0,
                respondido: 0,
            },
            names: {
                nao_resp: 'Respondido',
                  
            },
        }, options);
    container.data('grafico', settings);

    var data = [
    {
        name : settings.names.nao_resp,
        color: '#EA4643',
        y : settings.status.nao_resp || 1000,
        x : settings.status.respondido
    },

    ];
    var min = _.min(data, function(item, index){
         return item.y;
    });
    min['selected'] = true;
    container.highcharts({
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        legend: {
            borderColor: '#DBDBDB',
            layout: 'vertical',
        },
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: false
            }
        },
//        title: {
//            useHTML: true,
//            style: {
//                fontSize: '12px'
//            },
//            text: '<a href="'+settings.url_redirect+'" title="Gerenciar">'+ settings.titulo +'</a>',
//        },
        title: {
            text: '% de adesão da avaliação'
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px"></span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}% colaboradores</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: settings.names.nao_resp,
            data: [settings.status.nao_resp]
        }]
    });
    return container; 
};

$(function(){
    $("#teste_abas").tabs();
    $(".form-status .widget-body:first").tabs();
    $(".form-status .widget-body:eq(1)").tabs();
    $(".form-status .widget-body:eq(2)").tabs();

    // Remover caso encontrem quem ocuta a aba de tarefas
    /*setInterval(function(){
        $("#teste_abas .checklist a").show();
    }, 10);*/
});
