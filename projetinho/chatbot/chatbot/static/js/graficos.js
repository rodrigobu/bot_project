$.fn.grafico = function(options) {
    var container = this, 
        settings = $.extend({
            title: '',
            url_redirect: '',
            status: {
                valor_um: 0,
                valor_dois: 0,
            },
            names: {
                label1: LABEL1,
                label2: LABEL2,
            },
        }, options);
    container.data('grafico', settings);

    var data = [{
        name : settings.names.label1,
        color: '#307ecc',//'#EA4643',
        y : settings.status.valor_um || 0,
    },{
        name : settings.names.label2,
        color: '#E1D54E',
        y : settings.status.valor_dois || 0,
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
//        title: {
//            useHTML: true,
//            style: {
//                fontSize: '12px'
//            },
//            text: '<a href="'+settings.url_redirect+'" title="Gerenciar">'+ settings.titulo +'</a>',
//        },
        title: false,
        /*tooltip : {
            formatter: function() {
                return '' + this.key +': <b>' + parseFloat(parseFloat((''+this.y).replace(',', '.')).toFixed(2)) + '</b>';
            },
            style: {
                'fontSize': '11px'
            }
        },*/
        tooltip : {
            formatter: function() {
                return '' + this.key +': <b>'+ parseFloat(this.y) + '</b>';
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