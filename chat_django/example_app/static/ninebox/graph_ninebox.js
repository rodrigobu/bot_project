
function monta_grafico() {

    Highcharts.SVGRenderer.prototype.symbols.cross = function(x, y, w, h) {
        return ['M', x, y, 'L', x + w, y + h, 'M', x + w, y, 'L', x, y + h, 'z'];
    };
    if (Highcharts.VMLRenderer) {
        Highcharts.VMLRenderer.prototype.symbols.cross = Highcharts.SVGRenderer.prototype.symbols.cross;
    }
    var series = get_series();
    var grafico = {
        chart: {
            type: 'line',
            renderTo: 'container',
            zoomType: 'xy'
        },
        title: {
            text: TITULOS['grafico'],
            style:{
                family: 'Segoe UI,Helvetica Neue,Trebuchet MS,Verdana',
                size: 20,
                weight: 400,
                color:'#767676'
            }
        },
        subtitle: {
            text: SUBTITULO['grafico'],
            align: 'center',
            useHTML: false,
            style:{
                family: 'Segoe UI,Helvetica Neue,Trebuchet MS,Verdana',
                size: 14,
                weight: 400,
                color:'#767676'
            }
        },
        legend: {
            enabled: false
        },
        yAxis: get_yAxis(),
        xAxis: get_xAxis(),
        series: series,
        tooltip: {
            formatter: function() {
                var tooltip;
                var nome = this.point.name;
                var x = String(this.x);
                var y = String(this.y);
                tooltip = '<span style="color:' + this.series.color + '">' + nome + '</span><br/>' +
                    '<span style="color:' + this.series.color + '">Competência: ' + x + '%</span><br/>' +
                    '<span style="color:' + this.series.color + '">Entrega: ' + y + '%</span>';
                return tooltip;
            }
        },
        credits: {
            enabled: false
        }
    };

    Highcharts.chart('chart_ninebox', grafico);
    
    // let grafico_print = grafico;

    // grafico_print.chart.width = 700;

    // Highcharts.chart('chart_ninebox_print', grafico_print);

    /*var legenda = "";
    if (referencia["1"] != "") {
        legenda += '<g><g class="highcharts-legend-item" zIndex="1" transform="translate(0,0)"><path fill="none" d="M 0 11 L 16 11" stroke="" stroke-width="2"/><path fill="" d="M 8 7 C 13.328 7 13.328 15 8 15 C 2.6719999999999997 15 2.6719999999999997 7 8 7 Z"/><text x="21" y="15" style="color:#274b6d;font-size:12px;cursor:pointer;fill:#274b6d;" text-anchor="start" zIndex="2"><tspan x="21">' +
            referencia["1"] + '</tspan></text></g>';
    }
    if (referencia["2"] != "") {
        legenda += '<g class="highcharts-legend-item" zIndex="1" transform="translate(0,15)"><path fill="none" d="M 0 11 L 16 11" stroke="" stroke-width="2"/><path fill="" d="M 4 7 L 12 7 12 15 4 15 Z"/><text x="21" y="15" style="color:#274b6d;font-size:12px;cursor:pointer;fill:#274b6d;" text-anchor="start" zIndex="2"><tspan x="21">' +
            referencia["2"] + '</tspan></text></g></g>';
    }
    $legend = $('.highcharts-legend');
    $legend.html('<g zIndex="1">' + legenda + '</g>');*/

};

function get_series() {
    series = [];
    /// -- Para cada colaborador da lista, gera um ponto baseado no X e Y
    $.each(COLABS, function(idx, dado) {
        // Os dados precisam ser separados em chave (Nome do Colaborador) e valor (x,y,x2,y2)
        var chave = "";
        var valor = "";
        for (var i in dado) {
            chave = i;
            valor = dado[i];
        }
        // -- Dados do ciclo atual
        series_data = {
            point: {},
            dataLabels: {
                enabled: true,
                x: 0,
                formatter: function() {
                    var value = this.x;
                    return value == valor['x'] ? this.point.name.split(" ")[0] : null;
                },
            },
            data: [{
                name: chave,
                x: valor['x'],
                y: valor['y'],
                marker: {
                    symbol: 'circle'
                }
            }]
        };

        // -- Dados do ciclo anterior (quando houver x2 e y2)
        if (valor['x2'] || valor['y2']) {
            series_data.data.push({
                name: chave,
                x: valor['x2'],
                y: valor['y2'],
                marker: {
                    symbol: 'square'
                }
            });
        }
        series.push(series_data);

    });
    console.log(series);
    return series;
}

function get_yAxis() {
    /// -- Monta a Escala Y das Entregas
    dados_escalas = {
        'max_escala': ESCALAS['supera'],
        'titulo_grafico': TITULOS['escala_y'],
        'plotBands': [{
            from: 0,
            to: ESCALAS['natende_y']
        }, {
            from: ESCALAS['natende_y'],
            to: ESCALAS['desenv_y']
        }, {
            from: ESCALAS['desenv_y'],
            to: ESCALAS['atende_y']
        }, {
            from: ESCALAS['atende_y'],
            to: ESCALAS['supera']
        }],
        'plotLines': [{
            value: ESCALAS['natende_y'],
            width: 2,
            color: 'black'
        }, {
            value: ESCALAS['desenv_y'],
            width: 2,
            color: 'black'
        }, {
            value: ESCALAS['atende_y'],
            width: 2,
            color: 'black',
            dashStyle: 'dash'
        }, {
            value: ESCALAS['supera'],
            width: 2,
            color: 'black'
        }],
    };
    return Axis(dados_escalas, 'y');
}

function get_xAxis() {
    /// -- Monta a Escala X das Competências
    dados_escalas = {
        'max_escala': ESCALAS['atende_x'],
        'titulo_grafico': TITULOS['escala_x'],
        'plotBands': [{
            from: 0,
            to: ESCALAS['natende_x']
        }, {
            from: ESCALAS['natende_x'],
            to: ESCALAS['desenv_x']
        }, {
            from: ESCALAS['desenv_x'],
            to: ESCALAS['atende_x']
        }, ],
        'plotLines': [{
            value: ESCALAS['natende_x'],
            width: 2,
            color: 'black',
        }, {
            value: ESCALAS['desenv_x'],
            width: 2,
            color: 'black',
        }, {
            value: ESCALAS['atende_x'],
            width: 2,
            color: 'black',
        }, ],
    };
    return Axis(dados_escalas, 'x');
}

function Axis(dados_escalas, tipo) {
    /// -- Une os eixos
    eixo = [{
        min: 0,
        max: dados_escalas['max_escala'],
        title: {
            text: dados_escalas['titulo_grafico']
        },
        tickInterval: 10,
        plotBands: dados_escalas['plotBands'],
        plotLines: dados_escalas['plotLines']
    }, {
        min: 0,
        max: dados_escalas['max_escala'],
        title: {
            text: ''
        },
        tickInterval: 10,
        labels: {
            align: 'left',
            'rotation':0,
            formatter: function() {
                label = pos_labels(tipo, ESCALAS);
                var value = label[this.value];
                return value !== 'undefined' ? value : this.value;
            }
        },
        type: 'linear',
        opposite: true
    }];
    return eixo;
}

function pos_labels(tipo, escalas) {
    /// -- Monta as legendas dos eixos
    eixo = {};
    pos = 0;
    $.each(escalas, function(chave, valor) {
        soma = 0;
        contador = 0;
        if (chave.split('_')[1] == tipo || (tipo == 'y' && chave == 'supera')) {
            if (tipo == 'y') {
                for (i = pos; i <= valor; i += 10) {
                    soma += i;
                    contador += 1;
                    chave_label = chave.split('_')[0];
                }
                pos_label = soma / contador;
                resto = pos_label % 10;
                if (resto != 0) pos_label = ((pos_label + 10) - (resto));
            } else {
                chave_label = chave.split('_')[0];
                pos_label = pos + 10;
        				resto = pos_label % 10;
        				if (resto!=0) pos_label = ((pos_label+10) - (resto));
            }
            eixo[pos_label] = LABELS[chave_label];
            pos = valor;
        }
    });
    return eixo;
}
