$.fn.grafico = function(options) {
    var container = this, 
        settings = $.extend({
            title: '',
            url_redirect: '',
            status: {
                nao_respondido: 0,
                em_andamento: 0,
                resp_n_finalizada: 0,
                respondida:0,
            },
            names: {
                nao_respondido    : 'Não Respondida',
                em_andamento      : 'Em Andamento',
                resp_n_finalizada : 'Respondida e Não Encerrada',
                respondida        : 'Encerrada',
            },
        }, options);
    container.data('grafico', settings);

    var data = [{
        name : settings.names.nao_respondido,
        color: '#EA4643',// Vermelha
        y : settings.status.nao_respondido || 0,
    },{
        name : settings.names.em_andamento,
        color: '#FE9A2E', //Laranja
        y : settings.status.em_andamento || 0,
    },{
        name : settings.names.resp_n_finalizada,
        color: '#E1D54E',// Amarelo
        y : settings.status.resp_n_finalizada || 0,
    },{
        name : settings.names.respondida,
        color: '#65B54E',
        y : settings.status.respondida || 0,
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