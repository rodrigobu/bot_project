var map = null;
var context = null;
var get_map = null;
var erro_att = null;
var erro_trava = false;

// FUNÇÕES PARA TRAVA DO MAPA (INICIO)

function atualizar_tempo_mapa() {
    if(!erro_trava){
      $.ajax({
          url: URL_TRAVA + SETOR_ID,
          dataType: 'json',
          type: 'get',
          data: {},
          success: function(retorno) {
            if(retorno['status']=='nok'){
              erro_trava = true;
              $.dialogs.error(
                retorno['msg'],
                function() {
                    window.location.href = URL_HOME;
                }
              );
            }
          },
          error: function(xhr, status, text) {
              erro_att = xhr;
              erro_trava = true;
              $.dialogs.error(
                  TXT_CONEXAO,
                  function() {
                      window.location.href = URL_HOME;
                  }
              );
          },
      });
    }
};

function acao_destravar_mapa(do_after){
  to_return = false
  $.ajax({
      url: URL_DESTRAVAR + SETOR_ID,
      dataType: 'json',
      type: 'get',
      async: false,
      data: {},
      success: function(retorno) {
          to_return = true;
          try{
            do_after()
          }catch(e){}
      },
  });
  return to_return;
}

function destravar_mapa(e){
     e.preventDefault();
     return acao_destravar_mapa();
}

// FUNÇÕES PARA TRAVA DO MAPA (FIM)


function get_atribuicao_padrao() {
    $.get(URL_GET_ATRIBUICAO_PADRAO + SETOR_ID, {}, function(data) {
        var tbody = document.getElementById('atribuicao-tbody');
        tbody.innerHTML = '';
        for (var i = 0; i < data.length; i++) {
            var tr = document.createElement('tr');
            var td_descricao = document.createElement('td');
            var td_funcao = document.createElement('td');

            for (var j = 0; j < data[i].funcoes.length; j++) {
                var funcao = data[i].funcoes[j];

                var label = document.createElement('span')
                label.className = 'label map-funcao-label';
                label.innerHTML = funcao;

                td_funcao.appendChild(label);
            }
            td_descricao.innerHTML = data[i].atribuicao;

            tr.appendChild(td_descricao);
            tr.appendChild(td_funcao);
            tbody.appendChild(tr);
        }
    });
};

function recarregar_tela() {
    if ($(".hide_on_competencias:visible").length != 0) {
      acao_destravar_mapa(function(){
        window.location.href = window.location.href;
      });
    }
};

function get_form_funcao_descricao(el) {
    /* Esta função controla a dialog do formulário de Descrição de Função
    e o salvamento das informações.
    */
    var td = $(el).parents('td')[0];
    var funcao = td.myScope.value.descricao;
    if (funcao=="") {
      $.dialogs.error(HASH_FUNCAO_DESC['DIALOG_VALID_FUNCAO_DESC']);
      return;
    }
    var form_url = HASH_FUNCAO_DESC['URL_FUNCAO_DESC_FORM'] + funcao;
    mostrarCarregando();
    start_timer();
    var $dialog_funcao_desc = $("#funcao_desc_dialog");
    $.get(form_url, function(html) {
        $dialog_funcao_desc.html(html['html']);
        esconderCarregando();
        $dialog_funcao_desc.removeClass('hide').dialog({
            resizable: true,
            modal: true,
            title: HASH_FUNCAO_DESC['DIALOG_TITLE'] ,
            title_html: true,
            width: 700,
            buttons: [{
                    text: TXT_CANCELAR,
                    "class": "btn btn-xs",
                    click: function() {
                        $(this).dialog("close");
                    }
                },
                {
                    text: TXT_SALVAR,
                    id: 'btn-funcao-ok',
                    "class": "submit submitButton btn btn-sm btn-success",
                    click: function() {
                        get_atribuicao_padrao();
                        mostrarCarregando();
                        start_timer();
                        var form_url = HASH_FUNCAO_DESC['URL_FUNCAO_DESC_SALVAR'] + funcao;
                        $.post(form_url, $('#funcao-form-container').serialize(), function(retorno) {
                            esconderCarregando();
                            if(retorno['status']=='200'){
                              $.dialogs.success(TXT_SALVAR_SUCESSO);
                              $dialog_funcao_desc.dialog("close");
                              get_atribuicao_padrao();
                            }
                        });
                    }
                }
            ]
        });
    });
};

$(function() {

    verificador_mapa = setInterval(atualizar_tempo_mapa, 60000);

    // Mapa
    var mapa = document.getElementById("mapa");
    context = document.getElementById('context-mapa');
    // Buttons
    var btn = document.getElementById('add-line');
    var next_page = document.getElementById('next-page');
    var prev_page = document.getElementById('prev-page');
    var regiter_ct = document.getElementById('register_ct');
    var btn_config_ct = document.getElementById('btn-config-ct');
    var back_map = document.getElementById('back-map');
    // Page Control
    var quantidade_competencias = document.getElementById('quantidade-competencias');
    var filtro_produtos = document.getElementById('filtro-produtos');
    var quantidade_funcoes = document.getElementById('quantidade-funcoes');
    var inicio_funcoes = document.getElementById('inicio_funcoes');
    var funcao_filter = document.getElementById('funcao-filter');
    var page_total = document.getElementById('page_total');
    var page_num = document.getElementById('page_num');
    var change_page = document.getElementById('change_page');
    var carregar_funcoes = document.getElementById('carregar_funcoes');
    var carregar_menos_funcoes = document.getElementById('carregar_menos_funcoes');

    inicio_funcoes.value = 0;
    quantidade_competencias.value = 25;
    quantidade_funcoes.value = 40;

    // Filter
    var show_filters = document.getElementById('show_filters');
    var inicio = -1;
    var execute_on_render = [];
    var current_scope;
    var current_ref;

    // Ct config
    var ct_letters = document.getElementById('ct-letters');
    var ct_select_familia = document.getElementById('familias-config-ct');
    var ct_list = document.getElementById('ct_list_content');
    var ct_selected_list = document.getElementById('ct_selected');
    var btn_ct = document.getElementById('cadastra_ct');
    var cts = [];
    var selecteds_cts = [];
    var btn_busca_ct = document.getElementById('btn-busca-ct');
    var busca_ct = document.getElementById('busca-ct');
    var limpa_busca_ct = document.getElementById('btn-limpa-ct');
    var limpar_filtros = document.getElementById('remove-ct-filters');

    // atribuicao padrao
    var atribuicao_padrao = document.getElementById('atribuicao-padrao-wrapper');

    window.addEventListener("beforeunload", destravar_mapa);

    $("textarea").die("change");
    $("textarea").live("change", function() {
        var value = $(this).val();
        value = value.replace(/(\r\n|\n|\r)/gm, "");
        value = value.replace(/  +/g, ' ');
        value = value.trim();
        $(this).val(value);
        $(this).focus();
    });

    var change_cargo = function() {
        //- Captura os valores básicos
        var this_ele_cargo = $(this);
        var this_ele_cargo_puro = this;
        var oldValue = $(this_ele_cargo).attr("oldValue");
        var newValue = $(this_ele_cargo).val().toUpperCase();
        //- Não exibir se for a primeira fez do conteudo ou se não foi resetado pelo "Limpar"
        if ((oldValue == "" || oldValue == undefined) &&
            (!$(this_ele_cargo).attr("resetado") || $(this_ele_cargo).attr("resetado") == undefined)) {
            this_ele_cargo.defaultValue = newValue;
            $(this_ele_cargo).attr("oldValue", newValue);
            return true;
        }
        oldValue = oldValue.toUpperCase();
        // -- não exibir se o conteudo for o mesmo
        if (newValue == oldValue) {
            return true;
        }
        newValue = newValue.replace(/(\r\n|\n|\r)/gm, "");
        newValue = newValue.replace(/  +/g, ' ');
        newValue = newValue.trim();
        ///-- Captura as funções do cargo que mudou
        primeira_funcao = this_ele_cargo.parent().parent().find("td[title='Função']").find("textarea");
        if (primeira_funcao.val() != LBL_A_DISTRIBUIR) {
            var funcoes = primeira_funcao.val() != '' ? [primeira_funcao.val()] : [];
        } else {
            var funcoes = [];
        }
        var breaklist = false;
        $.each(this_ele_cargo.parent().parent().nextAll("tr"), function(idx, value) {
            tr = $(value);
            if (tr.find("[title='Cargo']").length != 0) {
                breaklist = true;
                return;
            }
            if (!breaklist) {
                td = tr.find("[title='Função']")
                var funcao_texto = td.find("textarea").val()
                if (funcao_texto != LBL_A_DISTRIBUIR) {
                    funcoes.push(td.find("textarea").val());
                }
            }
        });
        // - Senão houver funções, não tem o porque mudar
        if (funcoes.length == 0) {
            this_ele_cargo.defaultValue = newValue;
            $(this_ele_cargo).attr("oldValue", newValue);
            this_ele_cargo_puro.myScope.value[this_ele_cargo_puro.name] = newValue;
            return true;
        }

        //- A mudança deve ser confirmada
        $.dialogs.confirm(
            'Houve alteração de um ou mais cargos no MAP. Você realmente deseja alterá-lo(s)? <br/>' +
            'Se "Sim", o(s) novo(s) cargo(s) será(ão) alterado(s) para todo o MAP. <br/>' +
            'Se "Não" o(s) cargo(s) original(is) será(ão) mantido(s). ',
            function() {
                //- aplica o novo valor, chama a mudança e recarrega o mapa
                this_ele_cargo_puro.myScope.value[this_ele_cargo_puro.name] = oldValue;
                mostrarCarregando();
                map.save(false,
                    function(ret) {
                        //if (ret.has_error) {
                        if (($(".erro_mapa").length > 0)) {
                            this_ele_cargo.val(oldValue);
                            this_ele_cargo.html(oldValue);
                            $(this_ele_cargo).attr("oldValue", oldValue);
                            this_ele_cargo_puro.myScope.value[this_ele_cargo_puro.name] = oldValue;
                            esconderCarregando();
                            return;
                        } else {
                            //- Após o salvamento do mapa
                            $.get(URL_TROCAR_CARGO + SETOR_ID +
                                '&cargo_old=' + oldValue +
                                '&cargo_new=' + newValue +
                                '&funcoes=' + funcoes, {},
                                function(data) {
                                    esconderCarregando();
                                    if (data["status"] == "ok") {
                                        this_ele_cargo.val(newValue);
                                        $(this_ele_cargo).attr("oldValue", newValue);
                                        $(this_ele_cargo).attr("resetado", false);
                                        this_ele_cargo_puro.myScope.value[this_ele_cargo_puro.name] = newValue;
                                        //get_map();
                                        recarregar_tela();
                                    } else {
                                        $.dialogs.error("Não foi possível alterar o cargo");
                                        this_ele_cargo.val(oldValue);
                                        this_ele_cargo.html(oldValue);
                                        this_ele_cargo_puro.myScope.value[this_ele_cargo_puro.name] = oldValue;
                                        $(this_ele_cargo).attr("oldValue", oldValue);
                                        esconderCarregando();
                                    }
                                });
                        }
                    },
                    function() {
                        $.dialogs.error("Ocorreu um erro ao salvar o mapa.");
                        this_ele_cargo.val(oldValue);
                        this_ele_cargo.html(oldValue);
                        this_ele_cargo_puro.myScope.value[this_ele_cargo_puro.name] = oldValue;
                        $(this_ele_cargo).attr("oldValue", oldValue);
                        esconderCarregando();
                    }
                );
            },
            function() {
                //- retrona para o valor antigo
                this_ele_cargo.val(oldValue);
                this_ele_cargo.html(oldValue);
                this_ele_cargo_puro.myScope.value[this_ele_cargo_puro.name] = oldValue;
                $(this_ele_cargo).attr("oldValue", oldValue);
                esconderCarregando();
            }
        );
    };

    var ultimo_valor = [];
    var capturar_cargo = function(campo, newValue) {
        var valor = campo.val();
        // se bater o valor do campo da função com a funãço em pesquisa captura o cargo dela
        valor_cargo = campo.parent().parent().prevAll("[title='Cargo']").find("textarea").val();
        if (valor_cargo == undefined) {
            var valor_cargo = campo.parent().parent().prevAll("[title='Cargo']").find("textarea").val();
            if (valor_cargo == undefined) {
                tr = campo.parent().parent().parent();
                while (true) {
                    tr = tr.prev();
                    valor_cargo = tr.find("[title='Cargo']").find("textarea").val();
                    if (valor_cargo != "" && valor_cargo != undefined) {
                        break;
                    }
                    if (tr.prev() == undefined) break;
                }
            }
            if (valor_cargo == undefined) {
                tr = campo.parent().parent().parent();
                while (true) {
                    tr = tr.next();
                    valor_cargo = tr.find("[title='Cargo']").find("textarea").val();
                    if (valor_cargo != "" && valor_cargo != undefined) {
                        break;
                    }
                    if (tr.next() == undefined) break;
                }
            }
        }
        return valor_cargo
    }
    var change_funcao = function() {
        ultimo_valor = [];
        //- Captura os valores básicos
        var this_ele_funcao_puro = this;
        var this_ele = $(this);
        this_ele.addClass("em_edicao");
        var oldValue = $(this_ele).attr("oldValue");
        var newValue = $(this_ele).val().toUpperCase();
        if (oldValue != undefined)
            oldValue = oldValue.toUpperCase();
        // -- não exibir se o conteudo for o mesmo
        if (newValue == oldValue) {
            this_ele.removeClass("em_edicao");
            return true;
        }
        newValue = newValue.replace(/(\r\n|\n|\r)/gm, "");
        newValue = newValue.replace(/  +/g, ' ');
        newValue = newValue.trim();

        // - Se não houver a coluna de cargo, não tem esse processo
        if ($("[title='Cargo']").length == 0) {
            this_ele.removeClass("em_edicao");
            $(this_ele).attr("oldValue", newValue);
            $(this_ele).attr("resetado", false);
            return true;
        }

        //-- Captura e validação do cargo da função
        var campo_de_teste = $(this);
        var valor_cargo_trocado = capturar_cargo($(this_ele), newValue);
        if (valor_cargo_trocado == "") {
            this_ele.val("");
            this_ele.removeClass("em_edicao");
            this_ele_funcao_puro.myScope.value[this_ele_funcao_puro.name] = "";
            $.dialogs.error("É necessário inserir o cargo antes de preencher a função");
        }
        var valor_cargo = null;
        $.each($("[title='Função'] textarea:not(.em_edicao)"), function(idx, value) {
            var campo = $(this);
            var valor = campo.val();
            if (newValue == valor) {
                // se bater o valor do campo da função com a funãço em pesquisa captura o cargo dela
                valor_cargo = campo.parent().parent().prevAll("[title='Cargo']").find("textarea").val();
                if (valor_cargo == undefined) {
                    var valor_cargo = campo.parent().parent().prevAll("[title='Cargo']").find("textarea").val();
                    if (valor_cargo == undefined) {
                        tr = campo.parent().parent().parent();
                        while (true) {
                            tr = tr.prev();
                            valor_cargo = tr.find("[title='Cargo']").find("textarea").val();
                            if (valor_cargo != "" && valor_cargo != undefined) {
                                break;
                            }
                            if (tr.prev() == undefined) break;
                        }
                    }
                }
            }
            if (valor_cargo != null && valor_cargo != undefined) {
                ultimo_valor.push(valor_cargo)
                return false; // em tese ja encontrou
            }
        });
        valor_cargo = ultimo_valor.join();
        ultimo_valor = [];
        if (valor_cargo == valor_cargo_trocado || valor_cargo == undefined || valor_cargo == "") {
            this_ele.removeClass("em_edicao");
            $(this_ele).attr("oldValue", newValue);
            $(this_ele).attr("resetado", false);
            return true;
        } else {
            var funcoes = [newValue];
            $.dialogs.confirm(
                'Essa função esta com um cargo diferente. Você realmente deseja alterá-lo(s)? <br/>' +
                'Se "Sim", a função terá seu cargo trocado para todo o MAP. ',
                function() {
                    //- aplica o novo valor, chama a mudança e recarrega o mapa
                    this_ele_funcao_puro.myScope.value[this_ele_funcao_puro.name] = newValue;
                    mostrarCarregando();
                    map.save(false,
                        function(ret) {
                            if (ret.has_error) {
                                this_ele.val(oldValue);
                                $(this_ele).attr("oldValue", oldValue);
                                this_ele_funcao_puro.myScope.value[this_ele_funcao_puro.name] = oldValue;
                                esconderCarregando();
                                return;
                            }
                            //- Após o salvamento do mapa
                            $.get(URL_TROCAR_CARGO + SETOR_ID +
                                '&cargo_old=' + valor_cargo +
                                '&cargo_new=' + valor_cargo_trocado +
                                '&funcoes=' + funcoes, {},
                                function(data) {
                                    esconderCarregando();
                                    if (data["status"] == "ok") {
                                        this_ele.val(newValue);
                                        $(this_ele).attr("oldValue", newValue);
                                        $(this_ele).attr("resetado", false);
                                        this_ele_funcao_puro.myScope.value[this_ele_funcao_puro.name] = newValue;
                                        //get_map();
                                        recarregar_tela();
                                    } else {
                                        $.dialogs.error("Não foi possível alterar o cargo");
                                        this_ele.val(oldValue);
                                        $(this_ele).attr("oldValue", oldValue);
                                        this_ele_funcao_puro.myScope.value[this_ele_funcao_puro.name] = oldValue;
                                        esconderCarregando();
                                    }
                                });
                        },
                        function() {
                            $.dialogs.error("Ocorreu um erro ao salvar o mapa.");
                            this_ele.val(oldValue);
                            $(this_ele).attr("oldValue", oldValue);
                            this_ele_funcao_puro.myScope.value[this_ele_funcao_puro.name] = oldValue;
                            esconderCarregando();
                        }
                    );
                },
                function() {
                    //- retrona para o valor antigo
                    this_ele.val(oldValue);
                    $(this_ele).attr("oldValue", oldValue);
                    this_ele_funcao_puro.myScope.value[this_ele_funcao_puro.name] = oldValue;
                }
            );
        }

    }

    $(".cargo_field").die("blur");
    $(".cargo_field").live("blur", change_cargo);
    $(".funcao_field").die("blur");
    $(".funcao_field").live("blur", change_funcao);

    function on_render() {
        for (var i in execute_on_render) {
            execute_on_render[i]();
        }
    }

    function get_extra() {
        var funcao = $(funcao_filter).val();
        var extra = '';

        var quantidade_funcoes_num = quantidade_funcoes.value;
        var inicio_funcao = inicio_funcoes.value;

        return 'quantidade_funcoes=' + quantidade_funcoes_num + '&inicio_funcoes=' + inicio_funcao;

        if (funcao)
            return 'funcao_id=' + funcao
        else
            return ''
    }

    function set_btn_title(ref) {
        btn.innerHTML = '<i class="fa fa-plus"></i> Adicionar ' + map.model.get_title(ref);
    }


    get_map = function(no_save) {
        $('.show_on_map').show();
        $('.hide_on_dft').removeClass('hidden');
        $('.show_on_dft').addClass('hidden');
        $(atribuicao_padrao).show();
        inicio = -1;
        if (map && (no_save == undefined || no_save == false))
            map.save(true);

        mostrarCarregando();
        start_timer();
        $.get(URL_GET_TABELA_MAPA + SETOR_ID + '&' + get_extra(), {}, function(data) {
            esconderCarregando();
            map = new TableObject(
                mapa,
                data,
                context,
                URL_SALVAR + SETOR_ID + '&' + get_extra()
            );
            map.render_all(on_render);

            set_btn_title(map.model.get_first_ref());
            $('.hide_on_competencias').removeClass('hidden');
            $('.show_on_competencias').addClass('hidden');
            $("#next-page").show();
            set_page_total(data['count_competencias']);
            page_num.value = 1;
            get_atribuicao_padrao();
        });
    }

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (map) {
            if (current_scope && current_ref && current_ref) {
                var line = map.model.complete_line(map.model.get_next(current_ref))[0];
                current_scope[map.model.get_next(current_ref)].push(line);
                map.render_all();
            } else {
                map.add_empty_line();
            }
        }
    });

    function set_page_total(count) {
        var total = parseInt(count);
        var per_page = parseInt($(quantidade_competencias).val());

        page_total.value = Math.ceil((total / per_page)) + 1;
    }

    filtro_produtos.addEventListener('focus', function () {
        window.filtro_produto_atual_val = $(filtro_produtos).val();
    });

    function get_competencias_ajax(i, q) {
        $(atribuicao_padrao).hide();
        mostrarCarregando();
        start_timer();
        filtro_produto_val = $(filtro_produtos).val();
        if(!filtro_produto_val){
           filtro_produto_val = "";
        }
        $.get(URL_GET_COMPETENCIAS_MAPA + SETOR_ID + '&inicio=' + i + '&quantidade=' + q + '&filtro_produto=' + filtro_produto_val + '&' + get_extra(), {}, function(data) {
            map = new TableObject(
                mapa,
                data,
                context,
                URL_SAVE_COMPETENCIAS + SETOR_ID + '&inicio=' + i + '&quantidade=' + q + '&' + get_extra()
            );
            map.render_all();
            $('.hide_on_competencias').addClass('hidden');
            $('.show_on_competencias').removeClass('hidden');
            var qt = parseInt(data['count_competencias']);
            var qa = parseInt(data['count_aptidoes']);
            set_page_total(qt);

            if (qt == qa) {
                if (USA_COMPT_TEC == 'True') {
                    open_config_dialog();
                }
            }

            var rest_pages = parseInt((qt - i) / q);
            var total_pages = Math.ceil(qt / q);

            var current_page = total_pages - rest_pages + 1;

            if (qt - q - i <= 0)
                next_page.style.display = 'none';
            else
                next_page.style.display = 'block';

            var quantidade_funcoes_num = parseInt(quantidade_funcoes.value);
            var inicio_funcao = parseInt(inicio_funcoes.value);
            var count_atribuicoes = data['count_atribuicoes'];
            var desabilita_proximo = data['desabilita_proximo'];

            var produtos_novos = data['produtos'];
            produtos_html = ""
            $.each(produtos_novos, function(idx, value){
              produtos_html+="<option value="+value[0]+">"+value[1]+"</option>";
            })
            $(filtro_produtos).html(produtos_html);
            $(filtro_produtos).val(filtro_produto_val);
            try{
                var valor = $("#filtro-produtos").val();
                tem_anterior = $("#filtro-produtos option[value='"+valor+"']").prev().length !=0 ;
                if(!tem_anterior){
                    $("#btn_ant_produto").hide();
                } else {
                    $("#btn_ant_produto").show();
                }
                tem_proximo = $("#filtro-produtos option[value='"+valor+"']").next().length !=0 ;
                if(!tem_proximo){
                    $("#btn_prox_produto").hide();
                } else {
                    $("#btn_prox_produto").show();
                }
                $("#filtro-produtos-input").val( $("#filtro-produtos option[value='"+valor+"']").html() );
            } catch(e){
              $("#btn_prox_produto").hide();
              $("#btn_ant_produto").hide();
            }

            if (desabilita_proximo) {
                $(".show_on_map #next-page #span_arrow_next-page").parent().hide();
            } else {
                $(".show_on_map #next-page #span_arrow_next-page").parent().show();
            }

            var resetar = data['resetar'];
            if (resetar) {
                inicio = 0;
            }


            if (count_atribuicoes - inicio_funcao - quantidade_funcoes_num <= 0) {
                carregar_funcoes.style.display = 'none';
            } else {
                carregar_funcoes.style.display = 'inline-block';
            }

            page_num.value = current_page;

            //-- Ajuste de textos grandes das competências
            $.each($("#mapa.table th.vertical div"), function(idx, value) {
                dado_original = $(value).html();
                dado = $(value).html();
                novo_html = "";
                if (dado.length <= 36) {
                    $(value).attr("title", "");
                    return;
                }
                loop_count = 0;
                while (0 <= dado.length) {
                    if (loop_count == 1) {
                        novo_html += dado.substring(0, 36) + "...";
                        dado = dado.substring(0, 36);
                        break;
                    } else {
                        novo_html += dado.substring(0, 36) + "<br/>";
                        dado = dado.substring(36, dado.length);
                        loop_count += 1;
                    }
                }
                $(value).attr("title", dado_original);
                $(value).parent().css("padding-bottom", "0px");
                $(value).html(novo_html);
            });
            esconderCarregando();
        });
    }

    function get_competencias(i, q, no_save) {
        i = i || 0;
        q = parseInt(q) || $(quantidade_competencias).val();

        if (no_save == undefined) no_save = false;

        // remove this
        no_save = true;

        mostrarCarregando();
        start_timer();
        if (map && !no_save) {
            map.save(true, function() {
                esconderCarregando();
                get_competencias_ajax(i, q);
            }, function() {
                esconderCarregando();
                inicio = -1;
            });
        } else {
            get_competencias_ajax(i, q);
        }
    }

    // Run
    get_map();


    // Events for the map
    function set_autocomplete(e, url) {
        var cache = {};
        $(e).autocomplete({
            minLength: 4,
            autoFocus: true,
            select: function(event, ui) {
                e.myScope.value[e.name] = ui.item.value;
                e.myScope.pk = ui.item.pk;
            },
            source: function(request, response) {
                var term = request.term;
                if (term in cache) {
                    response(cache[term]);
                    return;
                }
                request.q = request.term;
                $.getJSON(url, request, function(data, status, xhr) {
                    cache[term] = data;
                    response(data);
                });
            }
        });
    };

    window.set_ct_title = function(el) {
        var td = el.parentNode;
        var scope = el.myScope;

        if (window.cts == undefined) {
            window.cts = [];
        }
        window.cts.push(el);

        td.title = 'Produto: ' + scope.value.produto + '\n';
        td.title += 'Atribuição: ' + scope.value.atribuicao + '\n';
        td.title += 'Função: ' + scope.value.funcao + '\n';
        td.title += '--------------------------\n';
        td.title += scope.value.ct;
    }

    window.value_is_text = function(el) {
        var options = el.childNodes;

        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            option.original_text = option.innerHTML;
            if (option.value)
                option.innerHTML = option.value;
        }

        var active_event = function() {
            var options = el.childNodes;

            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                option.innerHTML = option.original_text;
            }
        };

        var unactive_event = function() {
            var options = el.childNodes;

            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option.value)
                    option.innerHTML = option.value;
            }
        }

        el.addEventListener('focus', active_event);
        el.addEventListener('click', active_event);

        el.addEventListener('blur', unactive_event);
    }

    window.autocomplete_funcao = function(el) {
        set_autocomplete(el, URL_GET_FUNCOES);
    };

    window.autocomplete_cargos = function(el) {
        set_autocomplete(el, URL_GET_CARGOS);
    };

    window.form_funcao = function(el) {
        get_form_funcao_descricao(el);
    };

    document.getElementById('save-map').addEventListener('click', function(e) {
        e.preventDefault();
        mostrarCarregando();
        start_timer();
        map.save(false, function(e) {
            esconderCarregando();
            if (e == undefined || !e.has_error) {
                recarregar_tela();
            } else {
                get_atribuicao_padrao();
            }
        });
    });

    window.config_fields = function(e, nowhitespace, uppercase) {

        var wrapper = function() {
            if (nowhitespace) $(e).val($(e).val().replace(/(\r\n|\n|\r)/gm, " "));
            /*if (uppercase) $(e).val($(e).val().toUpperCase());*/
            e.style.height = e.scrollHeight + "px";

            $(e).bind('click focus', function() {
                var td = $(this).parents('td');
                var ref = td[0].ref;

                if (map.model.has_tree(ref)) {
                    set_btn_title(map.model.get_next(ref));
                    current_ref = ref;
                    current_scope = this.myScope;

                    td.addClass('active');
                } else {
                    current_ref = undefined;
                    current_scope = undefined;
                    set_btn_title(map.model.get_first_ref());
                }
            });

            $(e).blur(function() {
                $(e).parents('td').removeClass('active');
                tmp_scope = current_scope;
                tmp_ref = current_ref;

                setTimeout(function() {
                    if (tmp_scope == current_scope && tmp_ref == current_ref) {
                        set_btn_title(map.model.get_first_ref());
                        current_scope = undefined;
                        current_ref = undefined;
                    }
                }, 200);
            });
        };

        $(e).on('keydown click keyup keypress blur', wrapper);

        function fn() {
            setTimeout(function() {
                wrapper();
            }, 0);
        }

        execute_on_render.push(fn);
    };

    // Buttons events
    var executar_next_page = function() {
        var qtd = parseInt($(quantidade_competencias).val());
        if (inicio >= 0) {
            inicio += qtd;
        } else {
            inicio = 0;
        }
        get_competencias(inicio, qtd);
    };

    next_page.addEventListener('click', function(e) {
        e.preventDefault();
        if ($('#next-page').find(".hide_on_competencias:visible").length == 1) {
            //- Mostras a dialog de salvamento
            $("#dialog-save").dialog({
                title: "Salvar mapa",
                buttons: [{
                        text: "Sim",
                        class: "btn btn-sm btn-primary",
                        click: function() {
                            mostrarCarregando();
                            start_timer();
                            map.save(false, function() {
                                esconderCarregando();
                                executar_next_page();
                                $("#dialog-save").dialog("close");
                            });
                        }
                    },
                    {
                        text: "Não",
                        class: "btn btn-sm",
                        click: function() {
                            executar_next_page();
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "Cancelar",
                        class: "btn btn-sm",
                        click: function() {
                            start_timer();
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        } else {
            executar_next_page();
        }
    });

    prev_page.addEventListener('click', function(e) {
        e.preventDefault();
        var qtd = parseInt($(quantidade_competencias).val());
        inicio -= qtd;

        if (inicio >= 0) {
            get_competencias(inicio, qtd);
        } else {
            inicio = -1;
            get_map(true);
        }
    });

    function check_total() {
        var qtd_funcoes = parseInt(quantidade_funcoes.value);
        var qtd_cts = parseInt(quantidade_competencias.value);
        var total = qtd_cts * qtd_funcoes;

        if (total > 2000) {
            $.dialogs.error('A quantidade de Competências Técnicas por Função / Atribuição não deve ser superior a 2000 registros.');
            esconderCarregando();
            return false;
        }
        return true;
    }

    quantidade_competencias.addEventListener('change', function() {
        if (check_total()) {
            get_competencias(inicio, $(quantidade_competencias).val());
        }
    });

    filtro_produtos.addEventListener('change', function() {
        dialogSalvarProduto(null, true);
    });

    function dialogSalvarProduto(novo, is_select=false) {

        $.dialogs.confirmCustom(
            "Atenção",
            "Deseja salvar o produto?<br/>Ao trocar de Produto, as ações não salvas serão perdidas.",
            "Sim", "Não",
            function () {  // Sim
                mostrarCarregando();
                map.save(false,
                    function (ret) {
                        if (($(".erro_mapa").length > 0)) {
                            // teve um erro ao salvar o mapa, não troca de produto para não perder as alterações
                            esconderCarregando();
                            return;
                        } else {
                            // Agora que salvou o mapa, troca o produto
                            if (novo) $(filtro_produtos).val(novo);
                            inicio = 0;
                            if (check_total()) {
                                get_competencias(inicio, $(quantidade_competencias).val());
                            }
                            return;
                        }
                    },
                    function () {
                    }
                );
            },
            function () {  // Não
                if (novo) $(filtro_produtos).val(novo);
                inicio = 0;
                if (check_total()) {
                    get_competencias(inicio, $(quantidade_competencias).val());
                }
                return;
            },
            function () {  // Cancelar
                if (is_select) filtro_produtos.value = filtro_produto_atual_val;
            }
        );
    }

    $("#btn_ant_produto").click(function(e) {
      e.preventDefault();

      var valor = $("#filtro-produtos").val();
      var novo = $("#filtro-produtos option[value='"+valor+"']").prev().val();

      dialogSalvarProduto(novo);

      /*$.dialogs.confirm(
        "Atenção",
        "Ao trocar de Produto, as ações não salvas serão perdidas. Deseja salvar o produto? ",
        function(){
        	var valor = $("#filtro-produtos").val();
        	var novo = $("#filtro-produtos option[value='"+valor+"']").prev().val();
        	$(filtro_produtos).val(novo);
          inicio = 0;
          if (check_total()) {
              get_competencias(inicio, $(quantidade_competencias).val());
          }
        },
        function(){}

      )*/
    });

    $("#btn_prox_produto").click(function(e) {
      e.preventDefault();

      var valor = $("#filtro-produtos").val();
      var novo = $("#filtro-produtos option[value='"+valor+"']").next().val();

      dialogSalvarProduto(novo);

      /*$.dialogs.confirm(
        "Atenção",
        "É preciso salvar as informações antes de trocar o Produto a ser trabalhado. Caso já tenha salvo e gostaria de ir para o próximo produto, clique em 'Sim'.",
        function(){
        	var valor = $("#filtro-produtos").val();
        	var novo = $("#filtro-produtos option[value='"+valor+"']").next().val();
        	$(filtro_produtos).val(novo);
          inicio = 0;
          if (check_total()) {
              get_competencias(inicio, $(quantidade_competencias).val());
          }
        },
        function(){}

      )*/
    });

    quantidade_funcoes.addEventListener('change', function() {
        if (check_total()) {
            get_competencias(inicio, $(quantidade_competencias).val());
        }
    });

    inicio_funcoes.addEventListener('change', function() {
        get_competencias(inicio, $(quantidade_competencias).val());
    });

    carregar_funcoes.addEventListener('click', function(e) {
        e.preventDefault();
        inicio_funcoes.value = parseInt(inicio_funcoes.value) + parseInt(quantidade_funcoes.value);
        get_competencias(inicio, $(quantidade_competencias).val());
        if (inicio_funcoes.value > 0) {
            $(carregar_menos_funcoes).removeClass('hidden');
        }
    });

    carregar_menos_funcoes.addEventListener('click', function(e) {
        e.preventDefault();
        inicio_funcoes.value = parseInt(inicio_funcoes.value) - parseInt(quantidade_funcoes.value);
        if (inicio_funcoes.value <= 0) {
            inicio_funcoes.value = 0;
            $(carregar_menos_funcoes).addClass('hidden');
        }
        get_competencias(inicio, $(quantidade_competencias).val());
    });

    change_page.addEventListener('click', function(e) {
        e.preventDefault();
        var p = parseInt(page_num.value);
        var t = parseInt(page_total.value);
        var q = parseInt(quantidade_competencias.value);

        if (p > t)
            return $.dialogs.error('Quantidade de páginas é maior que o total');

        if (p < 1)
            return $.dialogs.error('Você deve selecionar uma página acima de zero');

        if (p === 1)
            return get_map(true);
        else
            get_competencias((p - 2) * q);
    });


    var ct_filters_data = {};
    var ct_filters = {
        'letter': function(cts, letter) {
            if (letter === undefined)
                return cts;

            var filtered_cts = [];

            for (var i = 0; i < cts.length; i++) {
                var ct = cts[i];
                var ct_letter = ct.descricao[0].toUpperCase();
                if (ct_letter == letter)
                    filtered_cts.push(ct);
            }

            return filtered_cts;
        },
        'familia': function(cts, familia) {
            if (familia === undefined)
                return cts;

            var filtered_cts = [];

            for (var i = 0; i < cts.length; i++) {
                var ct = cts[i];
                if (ct.familia == familia)
                    filtered_cts.push(ct);
            }

            return filtered_cts;
        },
        'busca': function(cts, text) {
            if (text === undefined && text.length > 0)
                return cts;

            var filtered_cts = [];

            for (var i = 0; i < cts.length; i++) {
                var ct = cts[i];
                if (ct.descricao.toUpperCase().indexOf(text.toUpperCase()) >= 0)
                    filtered_cts.push(ct);
            }

            btn_ct.className = '';
            $("#ct_dialog #id_descricao").val(text);
            return filtered_cts;
        }
    }

    var order_cts = function(cts) {
        return cts.sort(function(a, b) {
            if (a.descricao > b.descricao)
                return 1;
            if (a.descricao < b.descricao)
                return -1;
            return 0;
        })

    };

    var select_ct = function(ct) {
        for (var i = 0; i < cts.length; i++) {
            if (cts[i].id == ct.id) {
                cts.splice(i, 1);
                selecteds_cts.push(ct);
                return cts;
            }
        }
    };

    var unselect_ct = function(ct) {
        for (var i = 0; i < selecteds_cts.length; i++) {
            if (selecteds_cts[i].id == ct.id) {
                selecteds_cts.splice(i, 1);
                cts.push(ct);
                order_cts(cts);
            }
        }
    };

    var show_cts = function(data) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < data.length; i++) {
            add_checkbox_ct(fragment, data[i]);
        }

        ct_list.innerHTML = '';
        if (data.length > 0) {
            ct_list.appendChild(fragment);
            btn_ct.className = 'hidden';
        } else {
            ct_list.innerHTML = 'Nenhuma competência encontrada.';
            btn_ct.className = '';
        }
    };

    var filter_cts = function() {
        filtered_cts = cts.slice(); // Método mais rápido de se copiar um vetor

        for (var key in ct_filters_data) {
            var fn = ct_filters[key];
            var data = ct_filters_data[key]
            filtered_cts = fn(filtered_cts, data);
        }

        show_cts(filtered_cts);
    }

    var set_ct_letters = function() {
        ct_letters.innerHTML = '';

        var letters = 'abcdefghijklmnopqrstuvxywvz'.toUpperCase();
        var as = [];

        for (var i = 0; i < letters.length; i++) {
            var letter = letters[i];
            var a = document.createElement('A');
            a.href = '#';
            a.innerHTML = letter;
            a.letter = letter;
            a.classList.add('btn');
            a.classList.add('btn-info');
            a.classList.add('btn-minier');
            a.classList.add('btn-white');
            a.style.marginRight = '5px';
            a.style.width = '18px';

            a.addEventListener('click', function(e) {
                e.preventDefault();
                this.blur();
                var self = this;
                $.each(as, function(i, a) {
                    if (a != self)
                        a.classList.remove('active');
                });

                var active = this.classList.toggle('active');

                if (active) {
                    ct_filters_data['letter'] = this.letter;
                } else {
                    delete ct_filters_data['letter'];
                }
                filter_cts();
            });

            ct_letters.appendChild(a);
            as.push(a);
        }
    }

    var get_familias = function(callback) {
        $.get(URL_GET_FAMILIA, callback);
    }

    var get_cts = function(callback) {
        $.get(URL_GET_CTS, callback);
    }

    var get_mapped_cts = function(callback) {
        $.get(URL_GET_MAPPED_CTS, {
            setor: SETOR_ID
        }, callback);
    }

    var add_selected_ct = function(dom, ct) {
        // <span class="tag">Editor de text<button type="button" class="close">×</button></span>
        var span = document.createElement('SPAN');
        var remove = document.createElement('BUTTON');

        remove.classList.add('close');
        remove.innerHTML = '×';
        remove.ct = ct;
        remove.addEventListener('click', function() {
            $(this.parentElement).remove();
            unselect_ct(this.ct);
            filter_cts();
        });

        span.classList.add('tag');
        span.appendChild(document.createTextNode(ct.descricao));
        span.appendChild(remove);

        dom.appendChild(span);
    }

    var add_checkbox_ct = function(dom, ct) {
        var div = document.createElement('DIV');
        var label = document.createElement('LABEL');
        var checkbox = document.createElement('INPUT');

        checkbox.type = 'checkbox';
        checkbox.value = ct.id;
        checkbox.ct = ct;

        checkbox.addEventListener('change', function(e) {
            e.preventDefault();
            if (this.checked) {
                select_ct(this.ct);
                add_selected_ct(ct_selected_list, this.ct);
                this.parentElement.parentElement.remove();
            }
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(ct.descricao));

        div.classList.add('checkbox');
        div.appendChild(label);

        dom.appendChild(div);
    }

    btn_busca_ct.addEventListener('click', function(e) {
        e.preventDefault();

        var text = busca_ct.value;
        ct_filters_data['busca'] = text;
        filter_cts();
        limpa_busca_ct.classList.remove('hide');
    });

    var limpar_busca = function() {
        busca_ct.value = '';
        delete ct_filters_data['busca'];
        limpa_busca_ct.classList.add('hide');

        btn_ct.className = 'hidden';
    }

    var limpar_familia = function() {
        ct_select_familia.value = '';
        delete ct_filters_data['familia'];
    }

    var limpar_letter = function() {
        set_ct_letters();
        delete ct_filters_data['letter'];
    }

    limpa_busca_ct.addEventListener('click', function(e) {
        e.preventDefault();
        limpar_busca();
        filter_cts();
    });

    limpar_filtros.addEventListener('click', function(e) {
        e.preventDefault();
        limpar_busca();
        limpar_familia();
        limpar_letter();
        filter_cts();
    })

    var open_cadastra_ct_dialog = function() {
        var $dialog_ct = $("#ct_dialog");

        $dialog_ct.removeClass('hide').dialog({
            resizable: true,
            //modal: true,
            title: "Cadastro de Competência Técnica",
            title_html: true,
            width: 700,
            buttons: [{
                    text: "Cancelar",
                    class: "btn btn-sm",
                    click: function() {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "Salvar",
                    id: 'btn-funcao-ok',
                    "class": "submit submitButton btn btn-sm btn-success",
                    click: function() {
                        var $rm = $dialog_ct.find('.has-error');
                        $rm.find('.help-block').remove();
                        $rm.removeClass('has-error');
                        var $content = $(this);
                        var $form = $content.find('form');
                        var $ok = $('#btn-funcao-ok');

                        $ok.attr('disabled', 'true');

                        $content.prepend('<div class="alert alert-info"><i class="icon-spinner icon-spin bigger-125"></i> Salvando...</div>');

                        xhr = $.post(URL_CADASTRAR_CT, $form.serialize(), function(data) {
                            $content.find('.alert').remove();
                            $ok.removeAttr('disabled');
                            if (data['ok']) {
                                $content.dialog('close');
                                alert('Competência salva com sucesso');
                                $form.find('input').val('');
                                $form.find('textarea').val('');
                                $form.find('select').val('');
                                cts.push(data['ct']);
                                order_cts(cts);
                                show_cts(cts);
                                //var qtd = parseInt($(quantidade_competencias).val());
                                //get_competencias(inicio, qtd);
                            } else if (data['error']) {
                                for (var error in data['error']) {
                                    $dialog_ct.find('#div_id_' + error).addClass('has-error')
                                        .append('<span class="help-block"><strong>' + data['error'][error] + '</strong></span>');
                                }
                            } else {
                                $content.prepend('<div class="alert alert-danger">Ocorreu um erro desconhecido.</div>');
                            }
                        });
                    }
                }
            ]
        });
    };
    window.open_cadastra_ct_dialog = open_cadastra_ct_dialog;

    var open_config_dialog = function() {
        limpar_busca();
        limpar_familia();
        limpar_letter();

        var $dialog = $('#dialog-config-ct');
        var loading_cts = true;

        ct_list.innerHTML = 'Carregando competências...';
        ct_selected_list.innerHTML = 'Carregando competências mapeadas...';

        while (selecteds_cts.length > 0)
            selecteds_cts.pop();

        get_cts(function(data) {
            cts = data;
            show_cts(cts);
            get_mapped_cts(function(mapped_data) {
                ct_selected_list.innerHTML = '';

                for (var i = 0; i < mapped_data.length; i++) {
                    var ct = mapped_data[i];
                    select_ct(ct);
                    add_selected_ct(ct_selected_list, ct);
                }
                show_cts(cts);
                loading_cts = false;
            });
        });

        if (ct_select_familia.downloaded != true) {
            get_familias(function(familias) {
                $.each(familias, function(i, familia) {
                    var option = document.createElement('OPTION');
                    option.value = familia.id;
                    option.innerHTML = familia.descricao;
                    ct_select_familia.appendChild(option);
                });
                ct_select_familia.downloaded = true;
                ct_select_familia.addEventListener('change', function(e) {
                    e.preventDefault();
                    if (this.value) {
                        ct_filters_data['familia'] = this.value;
                    } else {
                        delete ct_filters_data['familia'];
                    }
                    filter_cts();
                });
            });
        }

        $dialog.removeClass('hide').dialog({
            title: "Gerenciamento de Competências Técnicas",
            width: 700,
            buttons: [{
                    text: "Cancelar",
                    class: "btn btn-sm",
                    click: function() {
                        $(this).dialog("close");
                    }
                },
                //{
                //    text: "Cadastrar Competência",
                //    class : "btn left-dialog-button btn-info btn-sm",
                //    click: open_cadastra_ct_dialog
                //},
                {
                    text: "Salvar",
                    id: 'btn-funcao-ok',
                    "class": "submit submitButton btn btn-sm btn-success",
                    click: function() {
                        if (loading_cts) {
                            $.dialogs.error('As competências técnicas ainda não foram completamente carregadas');
                            return;
                        }
                        mostrarCarregando();
                        start_timer();
                        var cts_ids = [];

                        for (var i = 0; i < selecteds_cts.length; i++) {
                            cts_ids.push(selecteds_cts[i].id);
                        }
                        var $dialog = $(this);
                        $.post(URL_UPDATE_MAPPED_CTS + SETOR_ID, {
                            cts: cts_ids
                        }, function() {
                            esconderCarregando();
                            $dialog.dialog('close');
                            var qtd = parseInt($(quantidade_competencias).val());
                            get_competencias(0, qtd, true);
                        })
                    }
                }


            ]

        });
    }

    btn_config_ct.addEventListener('click', function(e) {
        e.preventDefault();
        open_config_dialog();
    });

    back_map.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarCarregando()
        start_timer();
        var el = this;
        map.save(true, function() {
            esconderCarregando();
            location.href = el.href;
        });
    });
    $('[data-toggle="popover"]').popover()

    seg = 5 * 60;
    $timer_min = $("#timer_min");
    $timer_sec = $("#timer_sec");

    $('.chart').easyPieChart({
        animate: 1000,
        size: 43,
        barColor: '#438EB9',
        scaleColor: '#555',
        trackColor: '#555'
    });

    start_timer();

    $("#refresh_timer").click(function() {
        start_timer();
    });


    $("#export_map").click(function(e) {
        e.preventDefault();
        $('#text-export').remove();
        $('<div><textarea style="width: 100%; height: 100%" id="text-export"></textarea>').dialog({
            width: 400,
            height: 300,
            title: 'Exportar mapa'
        });
        $('#text-export').val(
            JSON.prune(
                map.model.get_data(),
                99999999999999999999999999999999999999999,
                99999999999999999999999999999999999999999
            )
        );
    });

    $("#import_map").click(function(e) {
        e.preventDefault();
        data = $.parseJSON(prompt());
        data['importacao'] = true;
        map.model.set_data(data);
        map.set_content(data);
        map.render_all();
        map.save();
    });

    var calc_mes = {};
    var calc_ano = {};
    var calc_frequencia = {};

    function do_calc(scope) {
        while (scope !== undefined && scope['usa_calc'] == undefined) {
            scope = scope.parent;
        }

        if (scope === undefined)
            return

        var tup_scope = scope['usa_calc'][0]['tup'][0]
        var demanda_scope = tup_scope['tipo'][0]['demanda'][0];
        var tup = tup_scope['value']['tup'];
        var demanda = parseFloat(demanda_scope['value']['demanda']);
        var mes = calc_mes[scope.funcao_atribuicao_id];
        var ano = calc_ano[scope.funcao_atribuicao_id];
        var frequencia = calc_frequencia[scope.funcao_atribuicao_id];

        var conversao_ano = parseFloat($(frequencia).children('option:selected').data('conversao-ano'));
        var conversao_mes = parseFloat($(frequencia).children('option:selected').data('conversao-mes'));

        var total_mes = (tup * demanda * conversao_mes) / 60;
        var total_ano = (tup * demanda * conversao_ano) / 60;

        mes.value = total_mes;
        ano.value = total_ano;
    }

    window.set_calc = function(e) {
        events = ['keydown', 'keyup', 'focus', 'blur', 'change'];

        for (var i in events) {
            e.addEventListener(events[i], function() {
                do_calc(this.myScope);
            });
        }

        setTimeout(function() {
            do_calc(e.myScope);
        }, 250);
    }

    window.set_hour = function(e) {
        return;
        events = ['keydown', 'keyup', 'focus', 'blur', 'change'];

        for (var i in events) {
            e.addEventListener(events[i], function() {
                var value = this.value;

                value = value.replace(/\D/g, '');

                if (value) {
                    value = '' + parseInt(value);

                    while (value.length < 3) {
                        value = '0' + value;
                    }

                    this.value = value.substring(0, value.length - 2) + ':' + value.substring(value.length - 2);
                }
            });
        }
    }

    window.set_calc_ano = function(e) {
        calc_ano[e.myScope.funcao_atribuicao_id] = e;
    }
    window.set_calc_mes = function(e) {
        calc_mes[e.myScope.funcao_atribuicao_id] = e;
    }
    window.set_calc_frequencia = function(e) {
        calc_frequencia[e.myScope.funcao_atribuicao_id] = e;
        window.set_calc(e);
    }


});
