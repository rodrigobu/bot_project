function fechar_grafico() {
  $(this).hide();
  var id_meta = $(this).attr("id_meta");
  var container = "#" + $(this).attr("id_container");
  $(container).hide();
  $("#" + $(this).attr("id").replace("_close", "")).show();
  $("#col_meta_direta_" + id_meta).addClass("col-md-4");
  $("#col_meta_direta_" + id_meta).removeClass("col-md-8");
};

var PALETA_PADRAO = "SoftPastel";
var FONT_TITLE = {
  family: 'Segoe UI,Helvetica Neue,Trebuchet MS,Verdana',
  size: 20,
  weight: 400,
  color: '#767676'
};
var FONT_SUBTITLE = {
  family: 'Segoe UI,Helvetica Neue,Trebuchet MS,Verdana',
  size: 14,
  weight: 400,
  color: '#767676'
};

function gerar_grafico() {
  //-- Gera os gráfico de acordo com as infromações da meta.
  // É executada ao clicar nos botões de gráficos dos blocos de metas
  var id_meta = $(this).attr("id_meta");
  var container = "#" + $(this).attr("id_container");
  var fragmentada_simples = $(container).attr("fragmentada_simples");
  var modelo = parseInt($(container).attr("modelo"));
  var resultado = parseFloat($(container).attr("resultado").replace(",", "."));
  var limite = parseFloat($(container).attr("limite").replace(",", "."));
  var acordada = parseFloat($(container).attr("acordada").replace(",", "."));
  if (!limite || limite == '0') {
    if (resultado > acordada) {
      limite = resultado;
    } else {
      limite = acordada;
    }
  }
  $(container).show();
  if (modelo == 1 && fragmentada_simples == "False") {
    // -- Gráfico da meta simples
    var CHART_CONFIG = {
      value: resultado,
      scale: {
        startValue: 0,
        limite: limite,
        tickInterval: 20,
      },
      title: {
        font: {
          size: 10
        }
      },
      tooltip: {
        enabled: true
      },
      valueIndicator: {
        type: 'rangeBar',
        color: "#555555",
        text: {
          indent: 2,
        }
      },
      rangeContainer: {
        backgroundColor: 'firebrick',
        offset: 5,
        ranges: [{
            startValue: 0,
            endValue: PISO_AMARELO,
            color: "#d5080f"
          },
          {
            startValue: PISO_AMARELO,
            endValue: PISO_VERDE,
            color: "#f0ad4e"
          },
          {
            startValue: PISO_VERDE,
            endValue: limite,
            color: "#5cb85c"
          }
        ]
      },
    }
    $(container).dxCircularGauge(CHART_CONFIG);
  } else if (modelo == 1 && fragmentada_simples == "True") {
    // -- Gráfico da meta simples fracionadas
    dados = JSON.parse($(container).attr("dados_chart"))['dados'];
    dados = dados.map(function(currentValue, index, arr) {
      var new_score = currentValue["score"];
      currentValue["score"] = parseFloat(currentValue["score"]);
      return currentValue;
    });
    CONFIG_LINE_CHART = {
    palette: PALETA_PADRAO,
      dataSource: dados,
      commonSeriesSettings: {
        argumentField: "mes",
        type: "spline"
      },
      margin: {
        bottom: 20
      },
      argumentAxis: {
        valueMarginsEnabled: false,
        discreteAxisDivisionMode: "crossLabels",
        grid: {
          visible: true
        }
      },
      series: [{
        valueField: "score",
        name: "Atingido"
      }, ],
      legend: {
        verticalAlignment: "bottom",
        horizontalAlignment: "center",
        itemTextPosition: "bottom"
      },
      title: {
        text: "",
      },
      "export": {
        enabled: true
      },
      tooltip: {
        enabled: true,
        customizeTooltip: function(arg) {
          return {
            text: arg.valueText
          };
        }
      }
    };
    $(container).dxChart(CONFIG_LINE_CHART).dxChart("instance");
  } else if (modelo == 2) {
    // -- Gráfico da meta fracionada Estrutura
    dados = JSON.parse($(container).attr("dados_chart"))['dados'];
    dados = dados.map(function(currentValue, index, arr) {
      var new_score = currentValue["score"];
      currentValue["score"] = parseFloat(currentValue["score"]);
      var new_target = currentValue["target"];
      currentValue["target"] = parseFloat(currentValue["target"]);
      return currentValue;
    });
    CONFIG_LINE_CHART = {
    palette: PALETA_PADRAO,
      dataSource: dados,
      commonSeriesSettings: {
        argumentField: "mes",
        type: "spline"
      },
      margin: {
        bottom: 20
      },
      argumentAxis: {
        valueMarginsEnabled: false,
        discreteAxisDivisionMode: "crossLabels",
        grid: {
          visible: true
        }
      },
      series: [{
          valueField: "target",
          name: "Alvo"
        },
        {
          valueField: "score",
          name: "Atingido"
        },
      ],
      legend: {
        verticalAlignment: "bottom",
        horizontalAlignment: "center",
        itemTextPosition: "bottom"
      },
      title: {
        text: "",
      },
      "export": {
        enabled: true
      },
      tooltip: {
        enabled: true,
        customizeTooltip: function(arg) {
          return {
            text: arg.valueText
          };
        }
      }
    };
    $(container).dxChart(CONFIG_LINE_CHART).dxChart("instance");
  } else if (modelo == 4) {
      // -- Gráfico da meta por indicador
    $("#col_meta_direta_" + id_meta).removeClass("col-md-4");
    $("#col_meta_direta_" + id_meta).addClass("col-md-8");
    dados = JSON.parse($(container).attr("dados_chart"))['dados'];
    dados = dados.map(function(currentValue, index, arr) {
      var new_score = currentValue["resultado_parcial"];
      currentValue["resultado_parcial"] = parseFloat(currentValue["resultado_parcial"]);
      var new_target = currentValue["meta_acordada"];
      currentValue["meta_acordada"] = parseFloat(currentValue["meta_acordada"]);
      return currentValue;
    });
    CONFIG_LINE_CHART = {
    palette: PALETA_PADRAO,
      dataSource: dados,
      commonSeriesSettings: {
        argumentField: "descricao",
        type: "fullstackedbar"
      },
      barWidth: 0.5,
      margin: {
        bottom: 20
      },
      argumentAxis: {
        valueMarginsEnabled: false,
        discreteAxisDivisionMode: "crossLabels",
        grid: {
          visible: true
        },
        visible: true,
        label: {
          overlappingBehavior: 'rotate',
          rotationAngle: 45,
          customizeText: function() {
            if (this.value.length > 20) {
              return "<span title='" + this.value + "'>" + this.value.substr(0, 20) + "..." + "</span>";
            } else {
              return this.value
            }
          },
        },
      },
      series: [{
        type: 'bar',
        valueField: "resultado_parcial",
        name: "Atingido"
      }, {
        type: 'line',
        valueField: "meta_acordada",
        name: "Alvo"
      }, ],
      legend: {
        verticalAlignment: "bottom",
        horizontalAlignment: "center",
        itemTextPosition: "bottom"
      },
      title: {
        text: "",
      },
      "export": {
        enabled: true
      },
      tooltip: {
        enabled: true,
        customizeTooltip: function(arg) {
          console.log(arg)
          return {
            text: arg.originalArgument + ' : \n Valor ' + arg.seriesName + ': ' + arg.valueText
          };
        }
      }

    };
    $(container).dxChart(CONFIG_LINE_CHART).dxChart("instance");
  }
  $(this).hide();
  $("#" + $(this).attr("id") + "_close").show();
}


function excluir_meta(id_meta) {

  $.dialogs.confirm("Excluir Meta", "Deseja realmente excluir a meta?",
    function() {
      $.ajax({
        url: URL_EXC_META,
        type: 'get',
        dataType: 'json',
        async: false,
        data: {
          id: id_meta
        },
        success: function(dados) {
          $.dialogs.success("Meta excluída com sucesso.");
          montar_paineis();
        }
      });
    });

};


function gerar_graficos_gerais(data) {
  // -- Gráficos do Painel Geral
  var dados_metas = data["dados_metas"];
  ciclo_desc = $("#id_ciclo option[value='" + $("#id_ciclo").val() + "']").html();
  $("#span_qntd_geral").html(dados_metas["qtde_metas"]);

  /* ----------------------------------------- */
  /* ----------- Gráficos de Pizza ----------- */
  /* ----------------------------------------- */
  var types = ["shift", "hide", "none"];
  var CONFIG_PIE_CHART_01 = {
    palette: PALETA_PADRAO,
    resolveLabelOverlapping: types[0],
    series: [{
      argumentField: "distribuicao",
      valueField: "qtde",
      label: {
        visible: true,
        connector: {
          visible: true,
          width: 1
        },
        customizeText: function(arg) {
          return arg.valueText + " (" + arg.percentText + ")";
        },
        position: "columns",
      }
    }],
    legend: {
      verticalAlignment: "bottom",
      horizontalAlignment: "center",
      itemTextPosition: "bottom"
    }
  };

  // -- Gráfico do Cumprimenro de Metas
  CONFIG_PIE_CHART_01["dataSource"] = [{
    distribuicao: "Metas Atingidas",
    qtde: dados_metas["qtde_atingidas"]
  }, {
    distribuicao: "Metas não Atingidas",
    qtde: dados_metas["qtde_n_atingidas"]
  }]
  $("#grafico_geral_01").dxPieChart(CONFIG_PIE_CHART_01);

  if ($("#grafico_geral_01_print").length) { // Utilizado no resumo do Colab
      $("#grafico_geral_01_print").dxPieChart(CONFIG_PIE_CHART_01);
  }

  // -- Gráfico do Status das Metas
  CONFIG_PIE_CHART_01["dataSource"] = [{
    distribuicao: "Metas Em Andamento",
    qtde: dados_metas["qtde_andamento"]
  }, {
    distribuicao: "Metas Não Iniciadas",
    qtde: dados_metas["qtde_n_iniciadas"]
  }, {
    distribuicao: "Metas Encerradas",
    qtde: dados_metas["qtde_encerrada"]
  }]
  $("#grafico_geral_02").dxPieChart(CONFIG_PIE_CHART_01);

  if ($("#grafico_geral_02_print").length) { // Utilizado no resumo do Colab
      $("#grafico_geral_02_print").dxPieChart(CONFIG_PIE_CHART_01);
  }

  // -- Gráfico Metas por Tipo de Abrangência
  $("#grafico_geral_05").dxPieChart({
    palette: PALETA_PADRAO,
    series: CONFIG_PIE_CHART_01['series'],
    resolveLabelOverlapping: types[0],
    title: {
      text: "Metas por Tipo de Abrangência",
      font: FONT_TITLE,
      subtitle: {
        text: "Ciclo: " + ciclo_desc + "\n Percentual de Metas por Tipo de Abrangência que estão relacionadas para este colaborador.",
        font: FONT_SUBTITLE
      },
    },
    legend: CONFIG_PIE_CHART_01['legend'],
    dataSource: [{
      distribuicao: "Colaborador",
      qtde: dados_metas["qtde_tipo_colaborador"]
    }, {
      distribuicao: "Função",
      qtde: dados_metas["qtde_tipo_funcao"]
    }, {
      distribuicao: "Equipe",
      qtde: dados_metas["qtde_tipo_equipe"]
    }, {
      distribuicao: "Setor",
      qtde: dados_metas["qtde_tipo_setor"]
    }, {
      distribuicao: "Filial",
      qtde: dados_metas["qtde_tipo_filial"]
    }, {
      distribuicao: "Empresa",
      qtde: dados_metas["qtde_tipo_empresa"]
    }]
  });

  // -- Gráfico Metas por por Perspectiva
  $("#grafico_geral_06").dxPieChart({
    palette: PALETA_PADRAO,
    series: CONFIG_PIE_CHART_01['series'],
    resolveLabelOverlapping: types[0],
    title: {
      text: "Metas por Perspectiva",
      font: FONT_TITLE,
      subtitle: {
        text: "Ciclo: " + ciclo_desc + "\n Percentual de Metas por Perspectiva que estão relacionadas para este colaborador.",
        font: FONT_SUBTITLE
      },
    },
    legend: CONFIG_PIE_CHART_01['legend'],
    dataSource: data['metas_por_perspectiva']
  });

  /* ----------------------------------------------------- */
  /* ----------- Gráficos do Panorama de Metas ----------- */
  /* ----------------------------------------------------- */
  $("#grafico_geral_03").dxChart({
    palette: PALETA_PADRAO,
    dataSource: data["metas_panorama_painel_geral"],
    commonSeriesSettings: {
      argumentField: "descricao",
      type: "candlestick"
    },
    legend: {
      visible: false
    },
    series: [{
      name: "DELL",
      openValueField: "gatilho_percentual",
      highValueField: "meta_acordada_percentual",
      lowValueField: "base",
      closeValueField: "resultado",
      color: 'cadetblue',
      border: {
        visible: false
      },
      reduction: {
        level: 'low',
      }
    }],
    argumentAxis: {
      visible: true,
      label: {
        overlappingBehavior: 'rotate',
        rotationAngle: 45,
        customizeText: function() {
          if (this.value.length > 20) {
            return "<span title='" + this.value + "'>" + this.value.substr(0, 20) + "..." + "</span>";
          } else {
            return this.value
          }
        },
      },
    },
    valueAxis: {
      tickInterval: 1,
      title: {
        text: "Valores da Meta (%)"
      },
      label: {
        format: {
          precision: 0
        }
      }
    },
    title: {
      text: "Panorama de Metas",
      font: FONT_TITLE,
      subtitle: {
        text: "Ciclo: " + ciclo_desc + "\n Aqui são mostradas as metas com o mínimo para contabilizar (Gatilho) e quanto atingiram de resultado.",
        font: FONT_SUBTITLE
      },
    },
    tooltip: {
      enabled: true,
      location: "edge",
      customizeTooltip: function(arg) {
        return {
          text: arg.argumentText + "<br/>Resutado Parcial/ Final: " + arg.closeValue + "%<br/>" +
            "Gatilho da Meta: " + arg.openValue + "%<br/>"
        };
      }
    }
  });

  /* ------------------------------------------------- */
  /* ----------- Gráficos de Metas por Mês ----------- */
  /* ------------------------------------------------- */
  $("#grafico_geral_045").dxChart({
    dataSource: data["metas_compilado_mensal_painel_geral"],
    palette: PALETA_PADRAO,
    commonSeriesSettings: {
      argumentField: "mes",
      valueField: "media",
      type: "bar"
    },
    argumentAxis: {
      valueMarginsEnabled: false,
      discreteAxisDivisionMode: "crossLabels",
      grid: {
        visible: true
      },
      visible: true
    },
    valueAxis: [{
      valueType: 'numeric',
      title: {
        text: "Percentual Médio"
      }
    }],
    seriesTemplate: {
      nameField: "mes",
      customizeSeries: function(valueFromNameField) {
        return {
          label: {
            visible: true,
            customizeText: function() {
              return this.value + '%';
            }
          }
        };
      }
    },
    equalBarWidth: false,
    legend: {
      visible: false,
    },
    title: {
      text: "Percentual Médio de Metas por Mês",
      font: FONT_TITLE,
      subtitle: {
        text: "Ciclo: " + ciclo_desc + "\n Percentual de conclusão compilado de meta por mês. São contabilizadas as metas por mês pela data de Apuração",
        font: FONT_SUBTITLE
      },
    },
    tooltip: {
      enabled: false
    }
  });


  $("#grafico_geral_046").dxChart({
    dataSource: data["metas_compilado_mensal_painel_geral"],
    palette: "SoftPastel",
    commonSeriesSettings: {
      argumentField: "mes",
      //  valueField: "qtde_metas",
      type: "line"
    },
    argumentAxis: {
      valueMarginsEnabled: false,
      discreteAxisDivisionMode: "crossLabels",
      grid: {
        visible: true
      },
      visible: true
    },
    series: [{
        valueField: "qtde_metas",
        name: "Qtde. Total no Mês"
      },
      {
        valueField: "qtde_andamento",
        name: "Qtde. em Andamento"
      },
      {
        valueField: "qtde_n_iniciadas",
        name: "Qtde. Não Iniciadas"
      },
      {
        valueField: "qtde_encerrada",
        name: "Qtde. Encerradas"
      },
      {
        valueField: "qtde_atingidas",
        name: "Qtde. Atingidas"
      },
      {
        valueField: "qtde_n_atingidas",
        name: "Qtde. Não Atingidas"
      }

    ],
    valueAxis: [{
      title: {
        text: "Qtde. de Metas"
      }
    }],
    onPointClick: function(e) {
      e.target.select();
    },
    onLegendClick: function(e) {
      var series = e.target;
      if (series.isVisible()) {
        series.hide();
      } else {
        series.show();
      }
    },
    equalBarWidth: false,
    legend: {
      verticalAlignment: "bottom",
      horizontalAlignment: "center"
    },
    title: {
      text: " ",
      font: FONT_TITLE,
      subtitle: {
        text: "Esse gráfico exibe a quantidade de metas classificadas para cada mês. Caso precise, clique na legenda para ocultar ou mostrar os dados de cada classificação.",
        font: FONT_SUBTITLE
      },
    },
    tooltip: {
      enabled: true,
      location: "edge",
      customizeTooltip: function(arg) {
        console.log(arg)
        return {
          text: arg.argumentText + "<br/> " + arg.seriesName + ": " + arg.value + "<br/>"
        };
      }
    }
  })

}

var montar_paineis = function() {
  $("#tab-3").html("");
  $.get(URL_PAINEIS, {
    'ciclo': $("#id_ciclo").val()
  }).done(function(data) {
    $("#tab-3").html(data["painel_geral"]);
    gerar_graficos_gerais(data);
    $("#tab-4").html(data["metas_diretas"]);
    $("#span_qntd_diretas").html(data["metas_diretas_len"]);
    $("#tab-5").html(data["metas_cadeia"]);
    $("#span_qntd_gerais").html(data["metas_cadeia_len"]);
    $("#tab-6").html(data["metas_como_gestor"]);
    $("#span_qntd_gestor").html(data["metas_como_gestor_len"]);
    $(".chart_meta_btn").click(gerar_grafico);
    $(".chart_meta_btn_close").click(fechar_grafico);
  });
};

$(function() {

  $("#id_ciclo").change(montar_paineis);
  $("#btn_recarregar_painel").click(montar_paineis);
  montar_paineis();
  $("[href='#tab-3']").click(montar_paineis)
  //verificador_mapa = setInterval(montar_paineis, 120000);

});
