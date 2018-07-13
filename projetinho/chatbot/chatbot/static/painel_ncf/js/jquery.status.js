$.fn.grafico = function(options) {
    var container = this, 
        settings = $.extend({
            title: '',
            url_redirect: '',
            status: {
                abertos: 0,
                pendentes: 0,
                finalizados: 0,
            },
            names: {
                abertos: 'Abertos',
                pendentes: 'Pendentes p/ Revisão',
                finalizados: 'Revisados/Finalizados',  
            },
        }, options);
    container.data('grafico', settings);

    var data = [{
        name : settings.names.abertos,
        color: '#EA4643',
        y : settings.status.abertos || 0,
    },{
        name : settings.names.pendentes,
        color: '#E1D54E',
        y : settings.status.pendentes || 0,
    },{
        name : settings.names.finalizados,
        color: '#65B54E',
        y : settings.status.finalizados || 0,
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
        subtitle: {
            useHTML: true,
            verticalAlign: 'bottom',
            text: '<a class="link_graficos" href="'+settings.url_redirect+'">Clique aqui para gerenciar: '+ settings.titulo +'</a>',
            style: {
                fontSize: '11px'
            }
        },
        /*tooltip : {
            formatter: function() {
                return '' + this.key +': <b>' + parseFloat(parseFloat((''+this.percentage).replace(',', '.')).toFixed(2)) + '%</b>';
            },
            style: {
                'fontSize': '11px'
            }
        },*/
        tooltip : {
            formatter: function() {
                return '' + this.key +': <b>'+this.y + '</b>';
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