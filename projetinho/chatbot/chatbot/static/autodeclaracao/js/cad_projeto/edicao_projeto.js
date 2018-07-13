/* CC */
var carregar_cc = function(do_after) {
    listagem_Geral('listagem_comp_comp', URL_CC, "", do_after);
};

var show_add_recursos = function() {
    $.get(URL_CC_TABLIST)
        .done(function(data) {
            mostrarCarregando();
            $('#add_recursos').html(data.html);
            $('#add_recursos').show();
        }).complete(function() {
            esconderCarregando();
        });

};

var carrega_cc_tablist = function(element) {
    if (!$(element).attr('open')) {
        var id = $(element).attr('id');
        mostrarCarregando();
        $.get(URL_CCIND_TABLIST + '&id=' + id)
            .done(function(data) {
                var container = $(element).attr('href');
                $(element).attr('open', 'open');
                $(container).html(data.html);
            }).complete(function(data) {
                esconderCarregando()
            });
    }
};

var recurso_check_click = function(element) {
    if ($(element).is(':checked')) {
        $('#id_' + $(element).val() + '_min').removeAttr('disabled');
    } else {
        $('#id_' + $(element).val() + '_min' + $(element).val()).prop('disabled', 'disabled');
    }
};

var verifica_cc_valido = function() {
    var list_items = $("input:checkbox[name=recurso]:checked");
    var valido = true;
    for (var item = 0; item < list_items.length; item++) {
        var id = $(list_items[item]).val();
        var min = $('#id_' + id + '_min').val();
        if (min != '') {
            valido = true;
        } else {
            valido = false;
            var cc = $(list_items[item]).attr('data-comp');
            $('#panel_' + cc).addClass('panel-danger');
            $('#lineid_' + $(list_items[item]).val()).addClass('danger');
            break;
        }
    }

    return valido;

};

var adiciona_recursos_cc = function() {
    mostrarCarregando();
    var valido = verifica_cc_valido();
    if (valido) {
        $("input:checkbox[name=recurso]:checked").each(function() {
            var min = $('#id_' + $(this).val() + '_min').val();
            var cc = {
                'ccind_id': $(this).val(),
                'id_projeto': $('#id_projeto').val(),
                'nivel_min': min,
            };
            $.ajax({
              type: 'POST',
              url: URL_SALVAR_CC,
              data: cc,
              success: function(dados) { },
              dataType: "json",
              async:false
            });
        });
        $.dialogs.success('Indicadores(s) salvo(s) com sucesso.');
        carregar_cc();
        $("#div_importacao").addClass("hidden");
        $('#add_recursos').html('');
        $('#cancelar_cadastro_comp_comp').hide();
        $('#novo_cadastro_comp_comp').show();
    } else {
        $.dialogs.error('Campo(s) preenchido(s) de forma incorreta.');
    }
    esconderCarregando();

};

var excluir_ProjetoCcind = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_CC, function(retorno) {
        mostrarCarregando();
        $('#cancelar_cadastro_comp_comp').click();
        carregar_cc(esconderCarregando);
        if (!retorno["tem_competencias_e_colabs"]) {
            $("#div_importacao").removeClass("hidden");
        } else {
            $("#div_importacao").addClass("hidden");
        }
    });
};


/* CT */
var salvar_ct = function() {
    disable_btn("cadastrar_comp_tec");
    if (!$('#cadastrar_comp_tec').parsley().isValid()) {
        enable_btn("cadastrar_comp_tec");
        return false;
    }
    var form = serializaForm('#cadastrar_comp_tec');
    form['id_projeto'] = ID_PROJETO;
    mostrarCarregando();
    $.post(URL_SALVAR_CT, form)
        .done(function(data) {
            $.dialogs.success('Competência Técnica salva com sucesso.');
            carregar_ct();
            $('#novo_cadastro_comp_tec').show();
            $('#cancelar_cadastro_comp_tec, #cadastrar_comp_tec').hide();
            enable_btn("cadastrar_comp_tec");
            $("#div_importacao").addClass("hidden");
        }).complete(function(data) {
            esconderCarregando();
            enable_btn("cadastrar_comp_tec");
        });
};

var carregar_ct = function(do_after) {
    listagem_Geral('listagem_comp_tec', URL_CT, "", do_after);
};

var carrega_selects_ct = function() {
    window.setTimeout(function() {
        var ct = $('#comp_tec').val();
        $.get(URL_GET_LABELS_CT + '&ct=' + ct)
            .done(function(data) {
                var html = '';
                for (var item in data) {
                    html += '<option value=' + data[item][0] + '>' + data[item][1] + '</option>';
                }
                $('#nivel_min_tec').empty().append(html);
                $('#nivel_ideal_tec').empty().append(html);
                configurar_selects_inicio_fim(
                    '#nivel_ideal_tec', '#nivel_min_tec',
                    'O Nível Mínimo não deve ser maior que o Nível Máximo.',
                    'O Nível Máximo não deve ser menor que o Nível Mínimo.'
                );
            });
    }, 10)
};

var excluir_ProjetoCT = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_CT, function(retorno) {
        mostrarCarregando();
        carregar_ct(esconderCarregando);
        if (!retorno["tem_competencias_e_colabs"]) {
            $("#div_importacao").removeClass("hidden");
        } else {
            $("#div_importacao").addClass("hidden");
        }
    });
};

 /* Palavras-chave */

 var salvar_palavra_chave = function() {
     disable_btn("cadastrar_pal_chave");
     var descricao = $('#pal_chave').val();
     var projeto_id = ID_PROJETO;
     mostrarCarregando();
     $.post(URL_SALVAR_PC, {'descricao' : descricao, 'projeto_id' : projeto_id})
         .done(function(data) {
             if (data['status'] == '200'){
                 $.dialogs.success('Palavra-chave salva com sucesso.');
                 carregar_palavras_chave();
                 hide_cadastrar_pal_chave();
            } else if (data['status'] == 'existe') {
                $.dialogs.error('Essa palavra-chave já existe.');
            }
         }).complete(function(data) {
             esconderCarregando();
             enable_btn("cadastrar_pal_chave");
         });
 };

 var carregar_palavras_chave = function(do_after) {
     listagem_Geral('listagem_pal_chave', URL_PALAVRA_CHAVE, "", do_after);
 };

var show_cadastrar_pal_chave = function() {
    $('#cancelar_cadastro_pal_chave').show();
    $('#novo_cadastro_pal_chave').hide();
    $('#div_campos_cad_pc').show();
    $('#pal_chave').focus();
};

var hide_cadastrar_pal_chave = function() {
    $('#novo_cadastro_pal_chave').show();
    $('#cancelar_cadastro_pal_chave').hide();
    $('#div_campos_cad_pc').hide();
    $('#pal_chave').val("");
}

var excluir_ProjetoPalavraChave = function(element) {
    var id = $(element).attr('id').replace('excluir_', '');
    excluir_Geral(id, URL_EXCLUIR_PC, function(retorno) {
        mostrarCarregando();
        carregar_palavras_chave(esconderCarregando);
        if (!retorno["tem_competencias_e_colabs"]) {
            $("#div_importacao").removeClass("hidden");
        } else {
            $("#div_importacao").addClass("hidden");
        }
    });
};

/* Estudos */
var carregar_estudo = function(do_after) {
    listagem_Geral('listagem_estudos', URL_ESTUDO, "", do_after);
};

var carregar_estudo_colabs = function(do_after) {
    listagem_Geral('listagem_estudos_colab',
         URL_ESTUDO_COLAB+"&id_estudo="+$("#id_estudo").val(),
         "", do_after);
};

var excluir_estudo = function(element) {
    var id = $(element).attr('estudo_id');
    excluir_Geral(id, URL_EXCLUIR_ESTUDO, function(retorno) {
        mostrarCarregando();
        carregar_estudo()
    });
};

var excluir_estudo_colab = function(element) {
    var id = $(element).attr('estudo_colab_id');
    excluir_Geral(id, URL_EXCLUIR_ESTUDO_COLAB, function(retorno) {
        mostrarCarregando();
        carregar_estudo_colabs()
    });
};

var ver_colabs_estudo = function(ele){
    $("#div_estudo_detalhes").show();
    $("#div_estudos").hide();
    $("#id_estudo").val( $(ele).attr("estudo_id") );
    $("#span_estudo").val( $(ele).attr("estudo_nome") );
    carregar_estudo_colabs();
};

var ver_det_aval_colab = function(id_colab){
  /* Monta a dialog de detalhes do desempenho */
  var url = URL_DET_COLAB_DESEMPENHO + '?projeto=' + ID_PROJETO
                   + '&id_colab=' + id_colab;

  $.get(url).success(function (dados) {
      $("#modal_detalhes").html(dados["html"]);
      $('[data-toggle="popover"]').popover();
      $("#modal_detalhes").dialog({
        hide: 'fade',
        show: 'fade',
        ace_theme: true,
        ace_title_icon_left: 'fa fa-edit',
        title: "Detalhes da Avaliação de Desempenho do Colaborador",
        width: '50%',
        buttons: {
          fechar: {
            click: function() {
              $(this).dialog('close');
            },
            'class': 'btn btn-xs btn-danger',
            text: "Cancelar"
          },
        },
        close: function() {
          $.loading.hide();
          $(this).dialog('close').dialog('destroy');
        },
      });
  });
};

var ver_det_mini_colab = function(id_colab){
  /* Monta a dialog de detalhes do perfil */
  var url = URL_DET_COLAB_PERFIL + '?projeto=' + ID_PROJETO
                   + '&id_colab=' + id_colab;

  $.get(url).success(function (dados) {
      $("#modal_detalhes").html(dados["html"]);
      $("#modal_detalhes").dialog({
        hide: 'fade',
        show: 'fade',
        ace_theme: true,
        ace_title_icon_left: 'fa fa-edit',
        title: "Detalhes do Perfil do Colaborador",
        width: '60%',
        buttons: {
          fechar: {
            click: function() {
              $(this).dialog('close');
            },
            'class': 'btn btn-xs btn-danger',
            text: "Cancelar"
          },
        },
        close: function() {
          $.loading.hide();
          $(this).dialog('close').dialog('destroy');
        },
      });

      //-- Iniciando o comportamento dos dados da dialog
      $(".bloco").hide();
      $("#pill_dados_pessoais").click(function(){
        $(".bloco").hide();
        $(".pill").removeClass("btn-info");
        $("#pill_dados_pessoais").addClass("btn-info");
        $("#div_dados_pessoais").show();
      });
      $("#pill_dados_pessoais").click();
      $("#pill_cts").click(function(){
        $(".bloco").hide();
        $(".pill").removeClass("btn-info");
        $("#pill_cts").addClass("btn-info");
        $("#div_cts").show();

        url_cts = URL_GET_COLAB_CTS + '?referencia_id=' + REF_PROJETO
                               + '&id_colab=' + id_colab;
        listagem_Geral('listagem_colabs_cts', url_cts, '#selecao_colabs_id');
      });
      $("#pill_cursos").click(function(){
        $(".bloco").hide();
        $(".pill").removeClass("btn-info");
        $("#pill_cursos").addClass("btn-info");
        $("#div_cursos").show();

        url_curso = URL_GET_COLAB_CURSOS + '?id_colab=' + id_colab;
        listagem_Geral('listagem_colabs_cursos', url_curso, '#selecao_colabs_id');
      });


  });
};

var ver_det_9box_colab = function(id_colab){
    /* Desvia para a ela da matriz ninebox travada no colaborador */
    var url = URL_DET_COLAB_9BOX + '?tk=' + id_colab
                     + '&ref=' + REF_PROJETO;
    window.open(url, '_blank');
};

var ver_det_cdc_colab = function(id_colab){
    /* Desvia para a ela do painel de desempenho travada no colaborador */
    var url = URL_DET_COLAB_PAINEL + '?tk=' + id_colab
                     + '&ref=' + REF_PROJETO;
    window.open(url, '_blank');

};


var fechar_grafico_ct = function(){
   fechar_grafico();
};

var fechar_grafico_cc = function(){
   fechar_grafico();
};

var montar_grafico_ct = function(){
    montar_grafico("ct");
    $("#abrir_grafico_ct").hide();
    $("#abrir_grafico_cc").hide();
    $("#fechar_grafico_ct").show();
    $("#fechar_grafico_cc").hide();
};

var montar_grafico_cc = function(){
    montar_grafico("cc");
    $("#abrir_grafico_ct").hide();
    $("#abrir_grafico_cc").hide();
    $("#fechar_grafico_ct").hide();
    $("#fechar_grafico_cc").show();
};

var fechar_grafico = function(){
  $("#container_grafico").hide();
  $("#abrir_grafico_ct").show();
  $("#abrir_grafico_cc").show();
  $("#fechar_grafico_ct").hide();
  $("#fechar_grafico_cc").hide();

};

var montar_grafico = function(tipo){
  if (tipo=="ct"){
    label = 'Técnica';
    labels = 'Técnicas';
  } else {
    label = 'Comportamental';
    labels = 'Comportamentais';
  }


  $.get(
      URL_GRAFICO_ESTUDO+"&id_estudo="+$("#id_estudo").val()+"&tipo="+tipo
  ).success(function (dados) {
      $('#container_grafico').highcharts( {
        chart: {
            type: 'column',
            zoomType: 'xy'
        },
        title: {
            text: 'Comparativo das Competências '+labels+' entre Projeto e Colaboradores do Estudo'
        },
        xAxis: {
            categories: dados["lista_desc"]
        },
        yAxis: {
            allowDecimals: false,
            min: 0,
            title: {
                text: 'Nível da Competência '+label
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            formatter: function () {
                    var tooltip;
                    var nome = this.series.name;
                    var x = String(this.x);
                    var y = String(this.y);
                    tooltip = '<span style="color:' + this.series.color + '">' + nome + '</span><br/>' +
                        '<span style="color:' + this.series.color + '">Competência: ' + x + '</span><br/>' +
                        '<span style="color:' + this.series.color + '">Nível: ' + y + '</span>';
                    return tooltip;
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
           column: {
               dataLabels: {
                   enabled: true,
                   rotation: 315,
                   y: -10,
               }
           }
        },
        series: dados["valores"]
      });
      $("#container_grafico").show();
      $(window).resize();
      $(".highcharts-container").css("min-width", "250px");
      $(".highcharts-container").css("min-heigth", "550px");
  }).error(function(){
      fechar_grafico()
  });
}


$(function() {
    //-- Geral:

    $('#div_campos_cad_pc').hide();
    $("#novo_projeto").insertAfter($(".page-header h1"));
    $("#novo_projeto").wrap("<div class='pull-right'> </div>").show();

    $('.aba_func').click(abre_aba);

    if (location.hash) {
        abas = {
            '#id_cc': ['#id_tab_cc', carregar_cc],
            '#id_ct': ['#id_tab_cc', carregar_ct],
            '#id_pc': ['#id_tab_pc', carregar_palavras_chave],
            '#id_estudo': ['#id_tab_estudo', carregar_estudo],
        };
        monta_hash_aba(abas);
    }

    $('.pill').click(function(e) {
        e.preventDefault();
        abre_bloco(this);
    });

    /*CC*/
    $('#novo_cadastro_comp_comp').click(function() {
        $('#add_recursos').html();
        $('#novo_cadastro_comp_comp').hide();
        $('#cancelar_cadastro_comp_comp').show();
        show_add_recursos();
    });

    $('#cancelar_cadastro_comp_comp').click(function() {
        $('#add_recursos').html('');
        $("#cancelar_cadastro_comp_comp").hide();
        $('#add_recursos').hide();
        $("#novo_cadastro_comp_comp").show();
    });

    /*CT*/
    $('#cadastrar_comp_tec').submit(function(event) {
        event.preventDefault();
        salvar_ct();
    });

    $('#novo_cadastro_comp_tec').click(function() {
        $.get(URL_GET_CT)
            .done(function(data) {
                $('#cadastrar_comp_tec').html(data.html);
                $('#novo_cadastro_comp_tec').hide();
                $('#cancelar_cadastro_comp_tec, #cadastrar_comp_tec').show();
                $('#comp_tec').on("keydown", function(event) {
                    $("#comp_tec").attr("id_elem", "");
                }).autocomplete({
                    source: URL_AUTO_CT,
                    minLength: 2,
                    select: carrega_selects_ct,
                });
                $('#cadastrar_comp_tec').parsley();
            });
    });

    $('#cancelar_cadastro_comp_tec').click(function() {
        $('#cadastrar_comp_tec').html("");
        $('#novo_cadastro_comp_tec, #cadastrar_comp_tec').show();
        $('#cancelar_cadastro_comp_tec').hide();
    });

    /* Palavra-chave */
    $('#novo_cadastro_pal_chave').click(show_cadastrar_pal_chave);
    $('#cancelar_cadastro_pal_chave').click(hide_cadastrar_pal_chave);

    $('#cadastrar_pal_chave').submit(function(e) {
        e.preventDefault();
        salvar_palavra_chave();
    });

    /* Estudos */
    $("#voltar_estudos").click(function(){
        $("#div_estudo_detalhes").hide();
        $("#div_estudos").show();
        $("#id_estudo").val("");
        $("#span_estudo").val("");
        fechar_grafico();
    });

    $("#abrir_grafico_ct").click(montar_grafico_ct);
    $("#abrir_grafico_cc").click(montar_grafico_cc);
    $("#fechar_grafico_ct").click(fechar_grafico_ct);
    $("#fechar_grafico_cc").click(fechar_grafico_cc);

    carregar_estudo();
    carregar_cc();
    carregar_ct();
    carregar_palavras_chave();

});
