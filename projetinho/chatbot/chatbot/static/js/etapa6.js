
$.fn.grafico = function(options) {
    var container = this, 
        settings = $.extend({
            title: '',
            status: {
                nao_resp:    0,
                andamento:   0,
                resp_nfinal: 0,
                resp_final:  0,
            },
            names: {
                nao_resp:    'Não Respondida',
                andamento:   'Em Andamento',
                resp_nfinal: 'Respondida e Não Encerrada',
                resp_final:  'Encerrada',
                  
            },
        }, options);
    container.data('grafico', settings);

    var data = [
    {
        name : settings.names.nao_resp,
        color: '#EA4643', // Vermelha
        y : settings.status.nao_resp || 0,
    },
    {
        name : settings.names.andamento,
        color: '#FE9A2E', //Laranja
        y : settings.status.andamento || 0,
    },
    {
        name : settings.names.resp_nfinal,
        color: '#E1D54E', // Amarelo
        y : settings.status.resp_nfinal || 0,
    },
    {
        name : settings.names.resp_final,
        color: '#65B54E', // Verde
        y : settings.status.resp_final || 0,
    }];
    var min = _.min(data, function(item, index){
         return item.y;
    });
    min['selected'] = true;
    container.highcharts({
        credits: {
            enabled: false
        },
        legend: {
            borderColor: '#DBDBDB',
            layout: 'vertical',
        },
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,    
            spacingBottom: 50
        },
        title: false,
        subtitle: {
            useHTML: true,
            verticalAlign: 'bottom',
            text: '<span>'+  (settings.titulo==undefined ? '' : settings.titulo) +'</span>',
            style: {
                fontSize: '11px'
            }
        },
        tooltip : {
            formatter: function() {
                return '' + this.key +': <b>' + parseFloat(parseFloat((''+this.y).replace(',', '.')).toFixed(2)) + '</b>';
            },
            style: {
                'fontSize': '11px'
            }
        },
        plotOptions : {
            pie : {
                cursor : 'pointer',
                allowPointSelect : true,
                showInLegend: true,
                dataLabels : {
                    distance: 5,
                    enabled : true,
                    color: '#000000',
                    format : '{point.percentage:.2f}%'
                }
            }
        },
        series : [{
            type : 'pie',
            name : ' ',
            data : data
        }]
    });
    return container; 
};

$(function(){
    $("#teste_abas").tabs();
    $(".form-status .widget-body:first").tabs();
    $(".form-status .widget-body:eq(1)").tabs();
    $(".form-status .widget-body:eq(2)").tabs();
});
