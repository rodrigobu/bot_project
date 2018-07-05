// nova competencia, novo registro
// function remove button
// devera ser carregado todo vez que um novo form
// for inserido no HTML
//
var HTML = '';
var VALID = true;
var ids_filial = [];
var ids_status = [];
var TEST_JSON = [];
// bloqueio botao voltar
window.history.forward();
     function noBack() {
         window.history.forward();
     }

// ncf tec
// apos montar "adicionar competencia" carregar codigo para remover
function buttonRemoveFresh() {
    $('.buttonRemove').live("click", function (){
        var id = (this.id);
        $('div.form_register' + id).html('');
    });
}

// portal pdi cadastro
// copiar conteudo para text area, especificação e observação
// após montar tabela com opções, carregar código
function radioButtonCadastroFresh() {

    $('input[name=opcao_acao_desenvolvimento]').live('click', function() {
        $.getJSON("/portal/pdi/cadastro/filtro/tabela/recurso/" + this.value + "/" , function(json){
           jQuery.each(json,function(){
                // clear fields
                $('input[name=acao_desenvolvimento]').val('');
                $('textarea[name=acao_especificacao]').val('');
                $('textarea[name=acao_observacao]').val('');

                // new values
                $('input[name=acao_desenvolvimento]').val(this.descricao);
                $('textarea[name=acao_especificacao]').val(this.especificacao);
                $('textarea[name=acao_observacao]').val(this.observacao);

                // alterar valor do input hidden chamada recurso
                $('input[name=recurso]').attr('value', this.recurso);
           });
        });
    });
}


// link encerrar, tela funcao.
// pegar id clicado
// mostrar dialog_encerrar_funcao + id
function encerrarFuncaoFresh() {
	    $('.encerrar_funcao').die("click");
        $('.encerrar_funcao').live("click", function() {
        	var id_aval = $(this).attr("id");
        	// qualquer nome onde contem dialog_encerrar_funcao*
            $('div[name=dialog_encerrar_funcao'+ id_aval +']').dialog({
                position      : 'top',
                closeOnEscape : true,
                resizable     : false,
                autoOpen      : false,
                show          : "blind",
                modal         : true,
                width         : 600,
                buttons: {
                    "Não": function() { $( this ).dialog( "close" ); },
                    "Sim": function() { // qual app esta rodando
                        var url = window.location.pathname.split('/');
                        var app = url[2];
                        $.get("/coleta/" + app + "/selecao/" + id_aval + "/encerrar/jq/", function(data){ callback(data); });
                        $( this ).dialog( "close" );
                    }
                }
            });
            $('div[name=dialog_encerrar_funcao' + id_aval + ']').dialog("open");
        });
    }

function _salvando_just(ID, d, justificativa, this_value, this_name, dialog){
	console.log(dialog);
	console.log($(dialog));
    mostrarCarregando();
    // post
    $.ajax({
        url      : '/coleta/' + app + '/justificativa/salvar/',
        type     : 'post',
		dataType : 'json',
		async    : false,
		data     : d,
        complete: function(data){
            HTML = JSON.parse( data["responseText"] )["resposta"];
            if(HTML==undefined){
            	HTML = data["responseText"];
            }
            /* apos ter um ID valido, do DB, alterar HTML para não ter o registro duplicado em caso de alteração do texto.
               verifica se ID é temporario, contains '_tmp*'
               se for, alterar para o novo ID, ID do registro que foi salvo.
               se ID contem string tmp, entao ID temporario*/
            if ( ID.indexOf("tmp") == 1 ){
                // se comentário é maior que zero
                $('img.escreve_comentario' + ID ).attr('src','/static/images/coleta/comment-ok.png');
                $('img.escreve_comentario' + ID ).attr('justif_cadastrada','true');
                //alterar valor do campo name input hidden da justificativa
                $("input[name=obrigatorio_questao]").each(function(){
                    if ( this_value == ID ){ this_value = HTML;  }
                });
                // for all apps TEXT JUSTIF alterar input hidden da justificativa
                $("[name=justif_text" + ID + "]").attr('name','justif_text' + HTML );
                // alterar input hidden da justificativa
                $("div[name=escreve_justif_" + ID + "]").attr('name','escreve_justif_' + HTML);
				if( $('[name=escreve_justif_' + ID + ']').length==0){
				    $('[name=escreve_justif_undefined]').hide();
				}else{
				    $('[name=escreve_justif_' + ID + ']').hide();
				}
                // botoes salvar, cancelar, alterar valor campo id
                $("a[id=" + ID + "]").attr('id', HTML);
                // alterar valor do campo name input hidden da justificativa
                $("input[name*=" + ID + "]").each(function(){
                    $('input[name=' + this_name + ']').attr('name', this_name.replace(ID, HTML));
                    if ( this_value == ID ){  this_value = HTML; }// new ID
                });
                $("input[name=justif_encerrada" + ID + "]").attr('name','justif_encerrada' + HTML);
                // alterar nome da classe
                $('img.escreve_comentario' + ID ).attr('class','escreve_comentario' + HTML );

			    // qual app esta rodando
			    app = window.location.pathname.split('/')[2];
			    // AVAL T
			    if ( app == 'avalt' ){
                    $("input[name=justif_avalrespt" + ID + "]").attr('name','justif_avalrespt' + HTML);
                    $("input[name=justif_competencia" + ID + "]").attr('name','justif_competencia' + HTML);
                    $("input[name=justif_avaliador" + ID + "]").attr('name','justif_avaliador' + HTML);
                    $("input[name=justif_avaliadorest" + ID + "]").attr('name','justif_avaliadorest' + HTML);
                    $("input[name=justif_avalrespt" + ID + "]").attr('name','justif_avalrespt' + HTML);
			    };
			    // AVAL R
			    if ( app == 'avalr' ){
                    $("input[name=justif_avaliadoresr" + ID + "]").attr('name','justif_avaliadoresr' + HTML);
                    $("input[name=justif_avaliador" + ID + "]").attr('name','justif_avaliador' + HTML);
                    $("select[id=resposta" + ID + "]").attr('name','resposta' + HTML);
                    $("input[name=justif_avalrespr" + ID + "]").attr('name','justif_avalrespr' + HTML);
			    };
			    // AVAL C OK
			    if ( app == 'avalc' ){
                    $("input[name=justif_avalrespc" + ID + "]").attr('name','justif_avalrespc' + HTML);
                    $("input[name=justif_indicador" + ID + "]").attr('name','justif_indicador' + HTML);
                    $("input[name=justif_avaliadoresc" + ID + "]").attr('name','justif_avaliadoresc' + HTML);
                    $("input[name=justif_avaliador" + ID + "]").attr('name','justif_avaliador' + HTML);
			    };
				$(dialog).dialog('close');
                /// ID valido
            } else {
                if ( data["responseText"].indexOf('resposta')!=-1 ){
                    HTML = JSON.parse( data["responseText"] )["resposta"];
                }else{
                    HTML = data["responseText"];
                }
                // se comentário é maior que zero
                if ( justificativa.length > 0 ){
                    // alterar icone para checked
                    $('img.escreve_comentario' + HTML).attr('src','/static/images/coleta/comment-ok.png');
                    $('img.escreve_comentario' + ID ).attr('justif_cadastrada','true');
                } else {
                    $('img.escreve_comentario' + HTML).attr('src','/static/images/coleta/comment-edit-icon.png');
                    $('img.escreve_comentario' + ID ).attr('justif_cadastrada','false');
                }
			    $(dialog).dialog('close');
            } // if tmp
            esconderCarregando();
        }, // complete
        error: function(data){
		    $.dialogs.error('Ocorreram erros ao salvar o comentário. Saia da avaliação e retorne mais tarde.');
            esconderCarregando();
        }
    }); // ajax
};

function salvar_justificativa(div, dialog){
    /*
     * Objetivo: Salva justificativa da avaliação
     * Utilização: Avaliações
     */
    var id = div.id;
    var this_name = div.name;
    var this_value = div.value;
    // qual app esta rodando
    var url = window.location.pathname.split('/');
    app = url[2];
    // justificativa
    var justificativa = $('textarea[name=justif_text' + id + ']').val();
    // AVAL T
    if ( app == 'avalt' ){
        var d = {
           avalrespt: $('input[name=justif_avalrespt' + id + ']').val(),
           justificativa: $('textarea[name=justif_text' + id + ']').val(),
           competencia: $('input[name=justif_competencia' + id + ']').val(),
           avaliador: $('input[name=justif_avaliador' + id + ']').val(),
           avaliadorest: $('input[name=justif_avaliadorest' + id + ']').val()
        };
    };
    // AVAL R
    if ( app == 'avalr' ){
        var d = {
            avalrespr : id,
            justificativa: $('textarea[name=justif_text' + id + ']').val(),
            questao: $('input[name=questao]').val(),
            avaliadoresr: $('input[name=justif_avaliadoresr' + id + ']').val(),
            avaliador: $('input[name=justif_avaliador' + id + ']').val(),
            resposta : $('select[id=resposta'+ id +'] option:selected').val()
        };
    };
    // AVAL C
    if ( app == 'avalc' ){
        var d = {
            avalrespc : id,
            justificativa: $('textarea[name=justif_text' + id + ']').val(),
            indicador: $('input[name=justif_indicador' + id + ']').val(),
            avaliadoresc: $('input[name=justif_avaliadoresc' + id + ']').val(),
            avaliador: $('input[name=justif_avaliador' + id + ']').val()
        };
    };
    // instanciar ID, pode ser temporario
    var ID = id;
    console.log("ID: "+ ID);
    console.log(d);
    // save inicial é false
    var save_just = false;
    // se ID contem string tmp, entao ID temporario
    if ( ID.indexOf("tmp") == 1 ){
        // texto justificativa não pode ser em branco ação botão salvar sem conteúdo
       if ( justificativa.length > 0 ) {  save_just = true;  }
    } else {
        // contém ID valido, salvar justificativa mesmo em branco
        save_just = true;
    }
    // se valido
    if ( save_just == true ){ _salvando_just(ID, d, justificativa, this_value, this_name, dialog);  }
};


function callback(data){
		/*
		 * Objetivo: Esta função irá substituir o ícone de status na tela de seleção.
		 * Utilização: Será utilizada por por todas as coletas
		 *
		 */
		console.log(" -- iniciei o processo de callback");
        var d = data.split(':');
        /* Resultado esperada do data
         * 		d[0] = Avaliadores*.id, ID do avaliador logado
         * 		d[1] = empresa.libera_visu_aval_* == 1, Se deve ou não remover o checkbox para edição de resposta
         * 		d[2] = app que será validada
         */
        if ( d[2] == 'avalt' || d[2] == 'avalr' || d[2] == 'avalc' ) {
        	console.log(d[1]);
        	console.log(d[1] == 'False');
            if ( d[1] == 'False' ) {
                $('td[name=funcao_status_input' + d[0] + ']').html('');
            }
        } else {
            $('td[name=funcao_status_input' + d[0] + ']').html('');
        }
        // alterar icones para green
        $('td[name=funcao_status_label' + d[0] + ']').html('<img class=\'green\' src=\'/static/images/coleta/Box_Green.png\'>Encerrada');

        // remover link
        $('td[name=encerrar_link' + d[0] + ']').html('');

        $("#"+d[0]+" :radio").remove();
        // remove opcao do select quando
        // nao tiver mais funcao naquele status

        // Pendente para revisão
        /*if ( $('input[id=4]').length == 0 ) {
            $(".seleciona_acao option[value='11']").remove();
            $(".seleciona_acao option[value='12']").remove();
        }

        // respondido e nao encerrado - NCF COMP
        if ( $('input[id=2]').length == 0 ) {
            $(".seleciona_acao option[value='5']").remove();
            $(".seleciona_acao option[value='7']").remove();
        }
        // respondido e nao encerrado - NCF TEC
        if ( $('input[id=2]').length == 0 ) {
            $(".seleciona_acao option[value='5']").remove();
            $(".seleciona_acao option[value='8']").remove();
        }
        // respondido e nao encerrado  - AVALT
        if ( $('input[id=2]').length == 0 ) {
            $(".seleciona_acao option[value='5']").remove();
            $(".seleciona_acao option[value='9']").remove();
        }
        // respondido e nao encerrado  - AVALC
        if ( $('input[id=2]').length == 0 ) {
            $(".seleciona_acao option[value='5']").remove();
            $(".seleciona_acao option[value='10']").remove();
        }
        // respondido e nao encerrado  - AVALR
        if ( $('input[id=2]').length == 0) {
            $(".seleciona_acao option[value='5']").remove();
            $(".seleciona_acao option[value='10']").remove();
        }*/
       esconderCarregando();
}



$(document).ready(function() {

	$('.buttonLoding').click(function(){
        mostrarCarregando();
    });

      function dimensions(){
			/*
			 * Objetivo: Esta função irá redimensionar o layout conforme o redimensionamento do browser
			 */
            var addFixTopContents = 20;
            var addRollContents = 7;
            var addBottomContents = 80;

            $("#fix_top_contents").css("top", $('#header').height()+addFixTopContents+"px");
            $("#roll_contents").css("top", $('#header').height()+addFixTopContents+jQuery('#fix_top_contents').height()+addRollContents+"px");
            $("#roll_contents").css("bottom", $('#fix_bottom_contents').height() + addBottomContents +"px");

            $("#roll_contents").css("display", "block");
            $("#roll_contents_ab").css("display", "block");
      }

      $(window).load(function() {
          dimensions();
      });

      $(window).resize(function() {
          dimensions();
      });


	/*
	 * ==========================================
	 * FUNÇÕES
	 * ==========================================
	 */

	/*
	 * ==== TODAS AS COLETAS =====
	 */



	/*
	 * === TELA DE SELAÇÃO DE COLABORADOR / FUNÇÃO GERAL
	 */



	    /*
	     * Objetivo: Verifica se foi selecionada pelo menos um colaborador ou funcao na tela de seleção
	     * Utilização: todas as coletas
	     * Chamada: No submit colocar a classe .valida, para cada checkbox obrigatorio adicionar a classe 'obrigatorio'.
	     */
	    $('input.valida, button.valida').click(function(){
	       if ( $('input.obrigatorio:checked').length < 1 ){
	           $('div[name=dialog_alert]').dialog("open");
	           return false;
	       }
	    });


	    /*
	     * Objetivo: Desmarcar todas as selecionadas na tela de seleção de colab/funcao
	     * Utilização: todas as coletas
	     */
	    function desmarcar_todas() {
	        $('input.todas_funcoes').removeAttr('checked');
	       $('input.obrigatorio').each(function(){
	          $(this).removeAttr('checked');
	       });
	    }


    /*
     * Objetivo: Executar as ações em massa da tela de seleção
     * Utilização: Todas as coletas
     */
    $('select.seleciona_acao').change(function(){
       n = $(this).val();
       console.log(n);
       // Marcar todas
       if (n == 1 ){
           $('input.todas_funcoes').prop('checked', true);
           $('input.obrigatorio').each(function(){
                $(this).prop('checked', true);
           });
       }
       // Desmarcar todas
       if (n == 2 ){
           desmarcar_todas();
       }
       // Marcar Não Respondidas
       if (n == 3 ){
           desmarcar_todas();
           $('input[id=2]').each(function(){
                $(this).prop('checked', !this.checked);
           });
       }
       // Marcar Em Andamento
       if (n == 4 ){
           desmarcar_todas();
           $('input[id=4]').each(function(){
                $(this).prop('checked', !this.checked);
           });
       }
       // Marcar Respondida nao encerradas
       if (n == 5 ){
           desmarcar_todas();
           $('input[id=3]').each(function(){
                $(this).prop('checked', !this.checked);
           });
       }

       // Marcar Pendente para revisão
       if (n == 11 ){
           desmarcar_todas();
           $('input[id=4]').each(function(){
                $(this).prop('checked', !this.checked);
           });
       }

       // Encerrar Respondidas e Não encerradas
       if ( n == 7 || n == 8 || n == 9 || n == 10 ){
          $('[name=dialog_alert_question]').dialog("open");
       }

       // Encerrar Pendente para Revisão - NCF Comp
       if ( n == 12 ){
          $('[name=dialog_alert_question_pendente_revisao]').dialog("open");
       }

       $('select.seleciona_acao option[value=0]').attr('selected', 'selected');

    });

    /*
     * Objetivo: Marcar todos quando o checkbox no topo da lista é marcado na tela de seleção
     * Utilização: Todas as coletas
     */
    $('input.todas_funcoes').click(function(){
       var n = $(this).is(":checked");
       if (n == 'checked' || n == true) {
           $('input.obrigatorio').each(function(){
                $(this).prop('checked', !this.checked);
           });
        } else {
           desmarcar_todas();
        }
    });


	/*
	 * Objetivo: Chamar o encerramento atraves da tela de selecao
	 */
    $('.encerrar_funcao').click(function() {
        $('[name=dialog_encerrar_funcao' + this.id + ']').dialog("open");
    });

	/*
	 * ====== TELAS DE QUESTIONÁRIO  GERAL =====
	 */

	/*
	 * Objetivo: Valida se todos os colaboradores foram respondidos
	 * Utilização: Todas as coletas
	 */
    $('.valida_resp_obrigatorio').click(function(){
       // qual app esta rodando
       var url = window.location.pathname.split('/');
       app = url[2];
       var VALID = '1';
       var f = $('input.obrigatorio_indicador').length;
       var t = $('input:checked').length;

       $('input.obrigatorio_indicador').each(function(){
     	   $('tr[id=' + this.value + ']' ).removeClass('errorBorder');
           var x = $('input[name=resposta' + this.value + ']:checked').val();
           // se valor radio check igual undefined
           if ( x == undefined){
              $('tr[id=' + this.value + ']' ).attr('class','errorBorder');
           }
       });
       // se quantidade diferente, existem questões não respondidas
       console.log(f);
       console.log(t);

       if (f != t ){
       	   esconderCarregando();
           $('[name=dialog_valor_invalido]').dialog("open");
           return false;
       }

    });


	/*
	 * ==== NCF TÉCNICO
	 */

    /*
     * Objetivo: Valida o nível ideal e o nível mínimo (se o mínimo é menor que o ideal)
     * Utilização: NCF Téc
     */
    $('input.valida_resp_competencia').click(function(){
        var VALID = true;
        $('tr').removeClass('error');

        // Competências já mapeadas para a função
        $('input[name=lista_competencia]').each(function(){

            // pegar id competencia
            var id = $(this).val();

            // valor select nivel min
            var min = $('select[name=nivel_min_access' + id + ']' ).val();

            // ideal
            var ideal = $('select[name=nivel_ideal_access' + id + ']' ).val();

            // None nao pode ser comparado
            if ( min == 'None'){
                var min = 999;
            }
            if ( ideal == 'None'){
                var ideal = 0;
            }

            // diferente de 'Nao é uma competencia da funcao'
            if ( min != '6.0000'){
                    if ( min > ideal ){
                        VALID = false;
                        $('tr[id=' + id + ']' ).attr('class','error');
                    }
            }

        });

        // Competências que foram adicionadas a função
        $('input[name=lista_competencia_ext]').each(function(){
            // pegar id competencia
            var id = $(this).val();
            // valor select nivel min
            var min = $('select[name=nivel_min_access_ext' + id + ']' ).val();
            // ideal
            var ideal = $('select[name=nivel_ideal_access_ext' + id + ']' ).val();
            // None nao pode ser comparado
            if ( min == 'None'){
                var min = 999;
            }
            if ( ideal == 'None'){
                var ideal = 0;
            }

            // diferente de 'Nao é uma competencia da funcao'
            if ( min != '6.0000' ){
                    if ( min > ideal ){
                        VALID = false;
                        $('tr[id=' + id + ']' ).attr('class','error');
                    }
            }

        });

        // if VALID
        if ( VALID == false ){
           var ok = $.dialogs.warning("Existem questões não respondidas do Mapeamento Técnico, responda-as antes de continuar");
           return false;

        }

    });


    /*
     * Objetivo: Desabilitar níveis e opção 'avaliar' quando é selecionado o nível 6 para a competência (competências novas)
     */
    $('select.verifica_niveis_ext').change(function(){
        // pegar id competencia
        var id = this.id;
        // valor select
        var op = $(this).val();

        // ligar ou desligar nivel ideal quando nivel min = 6
        // apenas para valores = 6.0000
        if ( op == '6.0000'){
            //$('input[name=nivel_ideal_access_ext' + id + ']').attr("disabled","true");
            $('input[name=avaliar_ext' + id + ']' ).attr("checked","");
            $('input[name=avaliar_ext' + id + ']' ).attr("disabled","true");
        } else {
            //$('input[name=nivel_ideal_access_ext' + id + ']').attr("disabled","");
            $('input[name=avaliar_ext' + id + ']' ).attr("checked","checked");
            $('input[name=avaliar_ext' + id + ']' ).attr("disabled","");
        }

        // valor select nivel min
        var min = $('select[name=nivel_min_access_ext' + id + ']' ).val();
        // pegar valor nivel_ideal da função
        var ide = $('select[name=nivel_ideal_access_ext' + id + ']' ).val();

        // verificar quando select_nivel_min > ideal
        // diferente de 6.0000 = 'Não é uma competencia da funcao'
        if ( min != '6.0000' ){
            // valor válido para ideal
            // se None, entao nao selecionou
            if ( ide != 'None' ){
                // verifica
                if ( min > ide ){
                   $.dialogs.error('Resposta Inválida. O \'Nível Mínimo\' de uma competência\nnão pode ser maior que do que o \'Nível Ideal\'\n\nReveja resposta da Competência: ' + $('input[value=' + id + ']' ).attr('id') );
                   return false;
                }
            }
        }
    });


    /*
     * Objetivo: Desabilitar níveis e opção 'avaliar' quando é selecionado o nível 6 para a competência (competências já mapeadas)
     */
    $('select.verifica_niveis').change(function(){
        // pegar id competencia
        var id = this.id;
        // valor select
        var op = $(this).val();

        // ligar ou desligar nivel ideal quando nivel min = 6
        // apenas para valores = 6.0000
        if ( op == '6.0000'){
            //$('select[name=nivel_ideal_access' + id + ']').attr("disabled","disabled");
            $('input[name=avaliar' + id + ']').attr("checked","");
            $('input[name=avaliar' + id + ']').attr("disabled","true");
        } else {
            //$('select[name=nivel_ideal_access' + id + ']').attr("disabled","");
            $('input[name=avaliar'+ id + ']' ).attr("checked","checked");
            $('input[name=avaliar'+ id + ']').attr("disabled","");
        }

        // valor select nivel min
        var min = $('select[name=nivel_min_access' + id + ']' ).val();
        // pegar valor nivel_ideal da função
        var ide = $('select[name=nivel_ideal_access' + id + ']' ).val();

        // verificar quando select_nivel_min > ideal
        // diferente de 6.0000 = 'Não é uma competencia da funcao'
        if ( min != '6.0000' ){
            // valor válido para ideal
            // se None, entao nao selecionou
            if ( ide != 'None' ){
                // verifica
                if ( min > ide ){
                   $.dialogs.error('Resposta Inválida. O \'Nível Mínimo\' de uma competência\nnão pode ser maior que do que o \'Nível Ideal\'\n\nReveja resposta da Competência: ' + $('input[value=' + id + ']' ).attr('id') );
                   return false;
                }
            }
        }
    });

	/*
	 * Objetivo: Na tela competencias cognitivas o botao adicionar competencias a funcao e proximo, são dois botoes diferentes com um funcao em comum, salvar o que está na tela
     * O HTML vem com
    <input type='hidden' name='adicionar_competencia' value='False'>
    <input type='hidden' name='responder_nao_cognitiva' value='True'>
     * Alterar valores quando botao add competencia for clicado
    <input type='hidden' name='adicionar_competencia' value='True'>
    <input type='hidden' name='responder_nao_cognitiva' value='False'>
    *
    * Utilização: NCF Técnico
    */

    $('input.adicionar_competencia_funcao').click(function(){
        $('input[name=adicionar_competencia]').attr('value','True');
        $('input[name=responder_nao_cognitiva]').attr('value','False');
    });



	/*
	 * Objetivo: Adicionar novas competências à função
	 * Utilização: NCF Técnico
	 */
    $('a.buttonAdd').click(function(){
        var id = $('input[name=lista_competencia_novo_registro]').length;

        // increment
        var id = id + 1;

        var HTML = '<div class=\'form_register' + id + '\'>';
        HTML += ' <fieldset id=\'' + id + '\' class=\' fborder\'>';
        HTML += '   <legend>Nova Competência</legend>';
        HTML += '      <input name=\'lista_competencia_novo_registro\' type=\'hidden\' value=\'' + id + '\'>';
        HTML += '      <p><label>';
        HTML += '         Descrição';
        HTML += '      </label>';
        HTML += '         <input type=\'text\' name=\'descricao' + id + '\' class=\'text add_compet \'></p>';
        HTML += '      <p><label for=\'nivel_min\' >';
        HTML += '        Nível Mínimo';
        HTML += '      </label>';
        HTML += '        <select name=\'nivel_min_access' + id + '\' class=\'respTec\'>';
        HTML += '           <option value=\'None\'>- - -</option>';
        HTML += '        </select></p>';
        HTML += '      <p><label for=\'nivel_ideal\' class=\'add_fields\'>';
        HTML += '        Nível Ideal';
        HTML += '      </label>';
        HTML += '        <select name=\'nivel_ideal_access' + id + '\' >';
        HTML += '           <option value=\'None\'>- - -</option>';
        HTML += '        </select></p>';
        HTML += '     <p><label class=\'checkbox\' for=\'avaliar\' >Avaliar';
        HTML += '       <input type=\'checkbox\' name=\'avaliar' + id + '\'></label>';
        HTML += '     </p>';
        HTML += '     <p style="float:right">';
        HTML += '           <a href=\'#\' class=\'buttonRemove\' type=\'button\' title=\'Apagar formul&aacute;rio para compet&ecirc;ncia\' name=\'remove\' id=\'' + id + '\'><img src=\'/static/images/remove.png\' ></a>';
        HTML += '     </p>';
        HTML += ' </fieldset>';
        HTML += '</div>';

        $('div#forms_novos_registros').append(HTML);

        // montar select com labels e valores parametrizado pela empresa
        $.getJSON("/ncf_tec/label-jq/", function(json){
           jQuery.each(json,function(){
               // nao adicionar opcao 'esta não é uma competencia da funcao'
               if (this.valor != '6.0000'){
                   $('select[name=nivel_min_access' + id + ']').append('<option value=\"' + this.valor + '\">' + this.label + '</option>');
                   $('select[name=nivel_ideal_access' + id + ']').append('<option value=\"' + this.valor + '\">' + this.label + '</option>');
               }
           });
        });

        buttonRemoveFresh();
    });


    /*
     * Objetivo: Na tela de competênicas não cognitivas habilitar o checkbox 'Avaliar' quando 'Necessária' for marcado
     * Utilização: NCF Técnico
     */
    $( "[name*=necessario_funcao]" ).change(function(){
        if ( this.checked == false ){
            $('input[name=avaliar' + this.id + ']').attr("checked","");
            $('input[name=avaliar' + this.id + ']').attr("disabled","true");
        } else {
            $('input[name=avaliar' + this.id + ']').attr("disabled","");
        }
    });

	/*
	 * Objetivo: Adicionar à lista competências novas.
	 * Utilização: NCF Técnico
	 */
    $('[name=lista_competencia_adicionar]').click(function(){
        if ( this.checked == true){
            $('[name=nivel_min_access' + this.value + ']' ).attr("disabled","");
            //$('[name=nivel_ideal_access' + this.value + ']' ).attr("disabled","");
            $('[name=avaliar' + this.value + ']' ).attr("disabled","");
        } else {
            $('[name=nivel_min_access' + this.value + ']' ).attr("disabled","disabled");
            $('[name=nivel_ideal_access' + this.value + ']' ).attr("disabled","disabled");
            $('[name=avaliar' + this.value + ']' ).attr("disabled","disabled");
        }
    });

	/*
	 * ==== AVALIAÇÃO GERAL ==
	 */



	/*
	 * Objetivo: Valida se existem justificativas obrigatórias e se no questionário tem alguma faltando.
	 * Utilização: Todas as coletas
	 */
    $('.valida_justif_obrigatoria').click(function(){

       if ( !MOSTRA_JUSTIF ){
           return true;
       }

       if ($('input[name=obrigatorio_justificativa]').length == 0) {
           return true;
       }

       var url = window.location.pathname.split('/');
       app = url[2];
       var VALID = '1';

       if ( app == 'avalt' ){
       	   var text_id_aval = 'avaliadorest';
       } else if ( app == 'avalr' ){
       	   var text_id_aval = 'avaliadoresr';
       } else if ( app == 'avalc' ){
           var text_id_aval = 'avaliadoresc';
       }

       // Para cada avaliado
       $('input[name=obrigatorio_justificativa]').each(function() {
           if(VALID == '0') return;
           var avaliado = this.value;
           var justif_cadastrada = $(".avaliadores_comen_"+avaliado+":first").attr("justif_cadastrada");
           var just_tam = $('textarea['+text_id_aval+'=justif_text' + avaliado + ']').val().replace(' ', '').length;
           // Se já esta cadastrada, não tem o porque continuar, proximo!
           if (justif_cadastrada=='true' || just_tam!=0 ) return;
           var resposta = $('input[name=resposta' + avaliado + ']:checked').val();

           if (obrigar_justif_0!=''){
                if((parseInt(resposta) == parseInt(resposta_justif_0)) || parseInt(resposta)==99  || parseInt(resposta)==98 ){
                    VALID = '0';
                }
           }

           if (obrigar_justif_1!=''){
               if((parseInt(resposta) == parseInt(resposta_justif_1)) || parseInt(resposta)==99  || parseInt(resposta)==98 ){
                   VALID = '0';
               }
           }

           if (obrigar_justif_2!=''){
               if((parseInt(resposta) == parseInt(resposta_justif_2)) || parseInt(resposta)==99  || parseInt(resposta)==98 ){
                   VALID = '0';
               }
           }

           if (obrigar_justif_3!=''){
                if((parseInt(resposta) == parseInt(resposta_justif_3)) || parseInt(resposta)==99  || parseInt(resposta)==98 ){
                    VALID = '0';
                }
           }

           if (obrigar_justif_4!=''){
               if((parseInt(resposta) == parseInt(resposta_justif_4)) || parseInt(resposta)==99  || parseInt(resposta)==98 ){
                   VALID = '0';
               }
           }

           if (obrigar_justif_5!=''){
                if((parseInt(resposta) == parseInt(resposta_justif_5)) || parseInt(resposta)==99  || parseInt(resposta)==98 ){
                    VALID = '0';
                }
           }
       }); // Fim Each
       // retornar false, existe pelo menos uma sem justificativa.
       if ( VALID == '0' ){
           $('[name=dialog_comentario_obrigatorio]').dialog("open");
       	   esconderCarregando();
           return false;
       }
    });


    /*
     * Objetivo: Mostrar tela de justificativa
     * Utilização: Avaliaçẽos
     */
    $('.dialog_click').click(function(e){
       $('[name=dialog_click' + this.id + ']' ).data('data', this.id).dialog("open");
    });


    /*
     * Objetivo: Abrir tela para escrita da justificativa
     * Utilização: Avaliações
     */
    $('.escreve_justif_abre').click(function(e){
        console.log(this.id);
        var div = this;
        var justif_encerrada = $('[name=justif_encerrada' + this.id + ']').val();
        console.log(justif_encerrada);
        var botoes = {};
        var seletor = '[name=escreve_justif_' + this.id + ']';
        console.log(seletor);
		var dialog = $(seletor);
        if (justif_encerrada=="encerrada"){
        	botoes = {
			    Fechar : {
				    click : function() { $(this).dialog('close'); },
					'class' : 'btn btn-xs btn-danger',
					text : "Fechar"
				}
			};
        }else{
        	botoes = {
			    Cancelar : {
				    click : function() { $(this).dialog('close'); },
					'class' : 'btn btn-xs btn-danger',
					text : "Cancelar"
				},
				Salvar : {
					click : function(){ salvar_justificativa(div, dialog); },
					'class' : 'btn btn-xs btn-success ',
					text : "Salvar"
				},
			};
		}
        $(seletor).dialog({
	        hide                : 'fade',
		    show                : 'fade',
		    ace_theme           : true,
		    ace_title_icon_left : 'fa fa-edit',
		    title               : "Justificativa",
		    width               : '40%',
		    buttons             : botoes,
			close : function() {
				$(this).dialog('close').dialog('destroy');
			},
			open: function(){  }
		});
    });

    /*
     * Objetivo: Fecha tela para escrita da justificativa
     * Utilização: Avaliações
     */

    $('.escreve_justif_fecha').click(function(){
       if( $('[name=escreve_justif_' + this.id + ']').length==0){
          $('[name=escreve_justif_undefined]').hide();
       }
       $('[name=escreve_justif_' + this.id + ']').hide();
       $('div#roll_contents').show();
    });


    /*
     * Objetivo: Abrir tela para consulta da justificativa
     * Utilização: Avaliações
     */
    $('.ler_justif_abre').click(function(){
       //$('[name=ler_justif' + this.id + ']').show();

       /*tamanho da pagina*/
       //var y = (window.innerHeight || document.documentElement.clientHeight) / 4;

       /*// modal recebe posicao */
       //$('div.box').attr('style','margin-top:'+ y +'px');

    });


    /*
     * Objetivo: Fecha a tela para consulta da justificativa
     * Utilização: Avaliações
     */
    $('.ler_justif_fecha').click(function(){
       $('[name=ler_justif' + this.id + ']').hide();
    });

    /*
     * Objetivo: Mostra/esconde a legenda com a escala numérica na avaliação, quando parametrizado para esse layout
     * Utilização: Avaliações
     */
    $('#escondeLegenda').click(function(){
    	mostraEscondeLegenda();
    });
     $('#mostraLegenda').click(function(){
		mostraEscondeLegenda();
	});

	function mostraEscondeLegenda(){

     	if ($('#legendaSuperior').is(":hidden")){
	     	$('#legendaSuperior').show("slow")	;
	     		dimensions();
	     		$('#escondeLegenda').css('display', 'block');
	     		$('#mostraLegenda').css('display', 'none')	;
	     		$('input[name=mostraLegenda]').val('true');
     	}else{
	     	$('#legendaSuperior').slideUp(100, function(){
	     		dimensions()	;
	     		$('#escondeLegenda').css('display', 'none');
	     		$('#mostraLegenda').css('display', 'block');
	     		$('input[name=mostraLegenda]').val('false');
	     			});
    	}
	}


	/*
	 * ===== AVALIAÇÃO COMPORTAMENTAL =====
	 */


    /*
     * Objetivo: Monta uma estrutura de accordion para que sejam respondidas as questões abertas da avaliação comportamental
     * Utilização: Avaliação Comportamental
     */
	 $(function() {
		$( "#divQuestab" ).accordion({
		heightStyle: "content"
		});
	});

    /*
     * Objetivo: Valida se as questões do questionário aberto foram respondidas
     * Utilização: Avaliação Comportamental
     */
    $('button.validaQuestab').click(function(){
    	var validado = true;
    	$("textarea.textResposta").each(function(){
    		if ($(this).val()==''){
    			 $('div[name=dialog_valida_questab]').dialog({
				        hide                : 'fade',
					    show                : 'fade',
					    ace_theme           : true,
					    ace_title_icon_left : 'fa fa-edit',
					    title               : "Encerrar Avaliação",
					    width               : '40%',
					    buttons             :  {
					    	 nao : {
							    click : function() {
							    	$(this).dialog('close').dialog('destroy');
        			                $('div[name=dialog_valida_questab]').addClass("divHidden").hide();
							    },
								'class' : 'btn btn-xs btn-danger',
								text : "Não"
							},
					    	sim : {
							    click : function() {
				                	$(this).dialog( "close" );
									$('<input>').attr({
									    type: 'hidden',
									    id: 'acao',
									    name: 'acao',
									    value: 'Encerrar Avaliação'
									}).appendTo('#form_Questab');
				                	$('#form_Questab').submit();
                                },
								'class' : 'btn btn-xs btn-success',
								text : "Sim"
							}
				        },
						close : function() {
							$(this).dialog('destroy');
        			        $('div[name=dialog_valida_questab]').addClass("divHidden").hide();
						}
					});
        			$('div[name=dialog_valida_questab]').dialog("open");

    			validado = false;
    		}
    	});
		return validado ;
    });


    /*
     * Objetivo: Salva as respostas do questionário aberto
     * Utilização: Avaliação Comportamental
     */
	$('button.salvaQuestab').click(function(event){
		event.preventDefault();
		if( $('textarea[name=' + this.id + '_fale_francamente]').val()=='' && $('textarea[name=' + this.id + '_fazer_melhor]').val()==''){
			$.dialogs.error("Os campos "+lbl_fale_francamente+" e "+lbl_fazer_melhor+" não foram preenchidos.");
			return;
		}
		var d = {
            avaliadoresc_id: this.id,
            fale_francamente: $('textarea[name=' + this.id + '_fale_francamente]').val(),
            fazer_melhor: $('textarea[name=' + this.id + '_fazer_melhor]').val(),
        };
        mostrarCarregando();
        // post
        $.ajax({
           async: false,
           url: '/coleta/avalc/questab/salva/jq/',
           type: 'POST',
           data: d,
           success: function(idResp){
        		$.dialogs.success('Os dados foram salvos com sucesso.');
        		$('img#' + $('button.salvaQuestab').attr('id') + '_imgQuestResp' ).attr('src','/static/images/coleta/comment-ok.png');
        		esconderCarregando();
           },
           error: function(idResp){
				$.dialogs.error('Ocorreram erros ao salvar a resposta. Saia da avaliação e retorne mais tarde.');
				esconderCarregando();
           }
        });
	});



	/*
	 * ===== AVALIAÇÃO COMPORTAMENTAL DE CONSENSO =====
	 */


    /*
     * Objetivo: Valida se todas as questões foram respondidas na avaliação comportamental de consenso
     * Utilização: avaliação comportamental de consenso
     * Chamada: Classe '.valida_consenso' no botão para salvar a avaliação
     */
    $('input.valida_consenso').click(function(){
    	if ( $('select.obrigatorio option[value="-1"]:selected').length > 0 ){
    		$('div[name=dialog_encerrar_aval]').dialog("open");
    			return false;
         }
    });

	/*
	 * Objetivo: Abrir tela de confirmação de saída quando o usuário pede para cancelar a avaliação comportamental de consenso
	 * Utilização: avaliação comportamental de consenso
	 * Chamada: Classe '.cancela_consenso' no botão para cancelar
	 */

    $('input.cancela_consenso').click(function(){
		$('div[name=dialog_cancelar_aval]').dialog("open");
			return false;

    });



	/*
	 * ==== AVALIAÇÃO TÉCNICA
	 */

	/*
	 * Objetivo: Validar se todas as perguntas foram respondidas na avaliação técnica com questionário invertido
	 * Utilização: Avaliação Técnica - invertida
	 */
    $('input.valida_avalt_invt').click(function(){
    	var validado = true;
    	$("select.respTec option:selected").each(function(){
    		if ($(this).val()=='-1'){
    			$('div[name=dialog_valor_invalido]').dialog("open");
    			validado = false;
    		}
    	});

		return validado;
    });



	/*
	 * ===== AVALIAÇÃO DE RESPONSABILIDADES ==========
	 */


    /*
     * Objetivo: Na tela de seleção de colaboradores volta para o filtro de relações, e reseta os filtros
     * Utilização: Avaliação de Responsabilidades
     */
    function reset_funcao_avalr() {
       // esconder o proprio botao
       $('a.reset_filtros').hide();

       // monstrar todos
       $('tr.filtro_funcao').show();
       $('tr.filtro_autoavaliacao').show();

       // msg
       $('div.div_msg_selec_funcao').show();
       $('div.div_msg_selec').hide();

       // hide result e filtro colaboradores
       $('tr.filtro_colaborador').hide();
       $('tr.result_colaborador').hide();

       // unselect all radio
       $('input').removeAttr('checked','');

       // limpara elementos anteriores
       $('tr.colaborador_added').html('');

       // esconder botao avancar caso autoavaliacao
       $('fieldset.ShowSubmit').hide();

       // esconder botoes
       $('input.defButton').each(function(){
         $('input.defButton').hide();
       });

       dimensions();
    }


    /*
     * Objetivo: Abre filtros quando selecionada uma relação na tela de seleção
     * Utilização: Avaliação de Responsabilidades
     */
    $('input.filtro_funcao').change(function(){
       var r = this.id;

	   // seta o id da função escolhida
	   $('input#id_funcao').val(this.id);

       // mostrar botao
       $('a.reset_filtros').show();

       // mostra msg
       $('div.div_msg_selec').show();

       // esconde msg
       $('div.div_msg_selec_funcao').hide();

       // esnconder botao avança autoavaliacao
       $('input[name=acao_autoavaliacao]').hide();

       // alterar action form funcao
       // por padrao action vai para autoavaliacao
       $('form.form_funcao').attr('action','/coleta/avalr/selecao/naoautoaval');
       // adicionar classe para validar checkbox colaborador
       $('input[name=acao]').addClass('valida');

       // Filtro de filial e status dos colaboradores
       $('select.filtro_colaborador_filial').html('');
       $('select.filtro_colaborador_status').html('');

       // Adiciona os dados dos colaboradores que estão participando
       $('select.filtro_colaborador_filial').append('<option value=\'None\'>Escolha uma filial</option>');
       $('select.filtro_colaborador_status').append('<option value=\'None\'>Escolha um status</option>');

       $.getJSON("/coleta/avalr/filtro/" + r + "/", function(json){
         jQuery.each(json,function(){
         	   if (this[0] == 'filial'){
	         	   jQuery.each(this[1], function(){
		           	   for(i=0; i < this.length; i++){
		           	   	$('select.filtro_colaborador_filial').append('<option value=' + this[i][0] + '>' + this[i][1] + '</option>');
		           	   }
	         	   });
     	      	};
	         	if(this[0] == 'status'){
	         	   jQuery.each(this[1], function(){
		           	   for(i=0; i < this.length; i++){
		           	   	$('select.filtro_colaborador_status').append('<option value=' + this[i][0] + '>' + this[i][1] + '</option>');
		           	   }
	         	   });
	         	};
           });
       });

       $('tr.filtro_funcao').each(function(){
           if (this.id != r){
               $('tr#' + this.id).hide();
           }
       });

       // esconder autoavalicao
       $('tr.filtro_autoavaliacao').hide();

       // mostrar filtro colaboradores
       $('#contents_selecao .filtro_colaborador').show();

	   lista_colabs();

	   dimensions();
    });


    /*
     * Objetivo: Reseta filtros na tela de seleção
     * Utilização: Avaliação de Responsabilidades
     */
    $('a.reset_filtros').click(function(){
        reset_funcao_avalr();
    });


    $('.buttonFilterFuncaoAvalr').live("click",function(){
    	lista_colabs();
    });
    $('input.buttonFilterFuncaoAvalr').live("click",function(){
    	lista_colabs();
    });

    /*
     * Objetivo: Listar os colaboradores quando for feito um filtro por filial ou status
     * Utilização: Avaliação de Responsabilidades
     */
    function lista_colabs(){


        // pegar valores
        var fu = $('input#id_funcao').val();				 // funcao
        var fi = $('select.filtro_colaborador_filial').val();// filial
        var fs = $('select.filtro_colaborador_status').val();// status
        var rl = $('input[name=funcao]:checked').val();      // funcao selecionada, 1o filtro
		$('td[name=encerrar_link' + fu + ']').html('');

        // acao em massa
        $('tr.result_colaborador').show();

        // mostrar botao avancar caso autoavaliacao
        $('input[name=acao_naoautoavaliacao], button[name=acao_naoautoavaliacao]').show();

        // limpara elementos anteriores
        $('tr.colaborador_added').html('');

        // busca relacao no BD
        // JSON
        $.getJSON("/coleta/avalr/filtro/colaborador/" + fu + "/" + fi + "/" + fs + '/', function(json){
        	mostrarCarregando();
            $.each(json["colabs"], function(idx, value){
               console.log(idx);
	           console.log(value);
               HTML = '<tr class="noborder colaborador_added  ' + value.color + '" >';
               HTML += '<td width="5%" class="centralizado" name="funcao_status_input' + value.id + '">';
               if ( (value.status != '1') || (value.libera_visu=='1'&& value.status =='1') ) { HTML += '<input name="lista_colabs" value="' + value.id + '" type="checkbox" id="' + value.status + '" class="obrigatorio" checked="checked"></td>'; }
               HTML += '<td width="25%">' + value.nome + '</td>';
               HTML += '<td width="25%">' + value.relacao + '</td>';
               // status
               if (value.status == 2){
                   HTML += '<td><img class="red" src="/static/images/coleta/Box_Red.png">Não Respondida</td>';
               }
               if (value.status == 4){
                   HTML += '<td><img class="orange" src="/static/images/coleta/Box_Orange.png">Em Andamento</td>';
               }
               if (value.status == 3){
                   HTML += '<td name=\'funcao_status_label' + value.id + '\'><img class="yellow" src="/static/images/coleta/Box_Yellow.png">Respondida e Não Encerrada</td>';
               }
               if (value.status == 1){
                   HTML += '<td><img class="green" src="/static/images/coleta/Box_Green.png">Encerrada</td>';
               }
               // acao
               if ( value.status == 3 ){
                   HTML += '<td class="encerrar_link" name="encerrar_link' + value.id + '">';
                   HTML += '<a id=\'' + value.id + '\' class=\'encerrar_funcao\' href=\'#\'><img src=\'/static/images/coleta/blog-delete-icon.png\'>Encerrar</a>';
                   HTML += '<div id=\'' + value.id + '\' name=\"dialog_encerrar_funcao' + value.id + '\" title=\"Encerrar Avalia&ccedil;&atilde;o.\">';
                   HTML += '<p>Tem certeza que deseja encerrar a Avaliação de Responsabilidades do Colaborador <br />' + value.nome + ' ? </p></div></td>';
               } else {
                   HTML += '<td width="20%"></td>';
               }
               HTML += '</tr>';
               // adicionar colaborador a lista
               $('table.result_colaborador_filtro').append(HTML);
               $('div[name*=dialog_encerrar_funcao]').dialog({autoOpen: false});
               // reload code
               encerrarFuncaoFresh();
               // Filtro de filial e status dos colaboradores
               $('select.filtro_colaborador_filial').html('');
               $('select.filtro_colaborador_status').html('');

               // Adiciona os dados dos colaboradores que estão participando
               $('select.filtro_colaborador_filial').append('<option value=\'None\'>Escolha uma filial</option>');
               $('select.filtro_colaborador_status').append('<option value=\'None\'>Escolha um status</option>');

	           $.getJSON("/coleta/avalr/filtro/" + $('input.filtro_funcao:checked').attr("id") + "/", function(json){
	     	       json = jQuery.parseJSON(json);
		           if (json[0][0] == 'filial'){
		               var array = json[0][1][0];
		               jQuery.each(array, function(idx, value){
		                   if($('select.filtro_colaborador_filial').find("option[value='" + value[0] + "']").length==0)
			         	       $('select.filtro_colaborador_filial').append('<option value=' + value[0] + '>' + value[1] + '</option>');
		               });
		           };
		           if(json[1][0] == 'status'){
		               var array = json[1][1][0];
		               jQuery.each(array, function(idx, value){
		                   if($('select.filtro_colaborador_status').find("option[value='" + value[0] + "']").length==0)
			         	       $('select.filtro_colaborador_status').append('<option value=' + value[0] + '>' + value[1] + '</option>');
		               });
		           };
	           });

           });
        esconderCarregando();
        });
    };



	/*
	 * Objetivo: Esconder os filtros por relação quando selecionada a opção autoavaliação na seleção de colaboradores
	 * Utilização: Avaliação de Responsabilidades
	 */
    $('input.filtro_autoavaliacao').click(function(){
       $('input[name=acao_autoavaliacao]').show();
       //$('form.form_funcao').attr('action','/coleta/avalr/selecao/autoaval/');
       $('form.form_funcao').attr('action','/coleta/avalr/autoaval/');
    });


	/*
	 * Objetivo: Verifica se selecionou respostas no questionário da autoavaliação
	 * Utilização: Avaliação de Responsabilidades
	 */
    $('.valida_questao_obrigatorio_autoavaliacao').click(function(){

       var f = $('input[name=questao]').length;
       var t = $('input:checked').length;

       // select dominio
       if ( $('select[name=dominio]').val() == 'None' ){
           $('div.dialog_dominio').dialog("open");
           return false;
       };

       // select relevancia
       if ( $('select[name=relevancia]').val() == 'None' ){
           $('div.dialog_relevancia').dialog("open");
           return false;
       };

       // show dialog, message
       if (f != t ){
       	   esconderCarregando();
           $('div.dialog_valor_invalido').dialog("open");
           return false;
       };
    });



	/*
	 * Objetivo: Verifica se selecionou respostas no questionário para outras relações (não autoavaliação) e valida a justificativa obrigatório
	 * Utilização: Avaliação de Responsabilidades
	 */
    $('.valida_questao_obrigatorio').click(function(){
       VALID = '1';

       var f = $('input[name=obrigatorio_questao]').length;
       var t = $('input:checked').length;

       if (f != t ){
           // show dialog
           esconderCarregando();
           $('[name=dialog_valor_invalido]').dialog("open");

           // destacar colaborador sem resposta com borda vermelha
           $('input[name=obrigatorio_questao]').each(function(){

               var x = $('input[name*=resposta]:checked').val();

               // se valor radio check igual undefined
               if ( x == undefined){
                  $('tr[id=' + this.value + ']' ).attr('class','errorBorder');
               }
           });
           return false;
       }



       // retornar false, existe pelo menos uma sem justificativa.
       if ( VALID == '0' ){
         return false;
       }

    });


	/* Valida questões no formulário invertido */
    $('input.valida_avalr_invt').click(function(){
    	var validado = true;
    	$("select.respostas option:selected").each(function(){
    		if ($(this).val()=='None'){
    			$('div[name=dialog_valor_invalido]').dialog("open");
    			validado = false;
    		}
    	});

		return validado;
    });



	/*
	 * ===========================================
	 * CAIXAS DE DIÁLOGO - DIALOG
	 * ===========================================
	 */


	/*
	 * ===== TODAS AS COLETAS ====
	 */

    /*
     * Objetivo: Caixa de Diálogo de confirmaçã para encerrar uma função (NCF) ou avaliação.
     * Utilização: Todas as coletas
     * Chamada: Abre a div que estiver com o name = dialog_encerrar_funcao*
     */
    $( "[name*=dialog_encerrar_funcao]" ).dialog({
       position: 'center',
       closeOnEscape: true,
       resizable: false,
       autoOpen: false,
       show: "blind",
       modal: true,
       width: 600,
       buttons: {
                    "Não": function() {
                     $( this ).dialog( "close" );
                    },

                    "Sim": function() {
                        // qual app esta rodando
                        var url = window.location.pathname.split('/');
                        app = url[2];
                        // encerrar funcao
                        $.get("/" + url[1] + '/' + app + '/selecao/' + this.id + "/encerrar/jq/", function(data){
                            //callback(data);
                            //avaliadores_id = data.split(':')[0];
                            //$('#'+avaliadores_id).hide();
                            $.dialogs.success('Encerrado com sucesso!');
                            document.location.reload();
                        });

                        // fecha
                        $( this ).dialog( "close" );
                    }
                }
    });



    /*
     * Objetivo: Mostar mensagem de alerta
     * Utilização: Todas as coletas
     * Chamada: Qualquer elemento div com a classe 'dialog_alert'
     */
    $( "div.dialog_alert" ).dialog({
       dialogClass: 'ui-state-error-text',
       closeOnEscape: true,
       resizable: false,
       autoOpen: false,
       show: "blind",
       modal: true,
       width: 600,
       buttons: {
                    "Fechar": function() {
                        $( this ).dialog( "close" );
                    }
                }
    });



    /*
     * Objetivo: Caixa de Diálogo de confirmação se deseja encerrar todas as 'Respondidas e Não Encerradas' através das ações em massa
     * Utilização: Todas as coletas
     * Chamada: Qualquer elemento div com a classe 'dialog_alert_question*'
     */
    $( "[name*=dialog_alert_question]" ).dialog({
       position: 'center',
       closeOnEscape: true,
       resizable: false,
       autoOpen: false,
       show: "blind",
       modal: true,
       width: 600,
       buttons: {
                    "Não": function() {
                     $( this ).dialog( "close" );
                    },

                    "Sim": function() {

                       // qual app esta rodando
                       var url = window.location.pathname.split('/');
                       app = url[2];
                       // check box
                       desmarcar_todas();

                       $('input[id=3]').each(function(){
                            $(this).attr('checked','checked');
                            // encerrar
			    $.get("/" + url[1] + '/' + app + '/selecao/' + this.value + "/encerrar/jq/", function(data){
                                // alterar HTML funcao
                                callback(data);
				avaliadores_id = data.split(':')[0];
				$('#'+avaliadores_id).hide();
                            });
                       $.dialogs.success('Encerrado com sucesso!');
                       });

                       // finaliza
                       desmarcar_todas();
                       $( this ).dialog( "close" );
                    }
                }
    });



    /*
     * Objetivo: Caixa de Diálogo se foi selecionado pelo menos uma resposta para o questionário
     * Utilização: Todas as coletas
     * Ex:	<input type='radio' class='obrigatorio_indicador'>
     * 		<input type='submit' class='valida_resp_obrigatorio'>
     * Chamada: Qualquer elemento div com a classe 'dialog_valor_invalido'
     */
    $("[name=dialog_valor_invalido]").dialog({
       position: 'center',
       resizable: false,
       autoOpen: false,
       show: "blind",
       modal: true,
       width: 500,
       buttons:{
            "Fechar": function() {
                $(this).dialog("close");
            }
       }

    });


    /*
     * Objetivo: Caixa de Diálogo de comentário obrigatório
     * Utilização: Todas as coletas
     * Chamada: Qualquer elemento div com a classe 'dialog_comentario_obrigatorio'
     */
    $("[name*=dialog_comentario_obrigatorio]").dialog({
       position: 'center',
       resizable: false,
       autoOpen: false,
       show: "blind",
       modal: true,
       width: 500,
       buttons:{
            "Fechar": function() {
                $(this).dialog("close");
            }
       }

    });



	/*
	 * ==== COLETA DO NCF COMPORTAMENTAL ====
	 */

    /*
     * Objetivo: Caixa de Diálogo de confirmação para encerrar todas as 'Pendentes para revisão' através das ações em massa
     * Utilização: Todas as coletas
     * Chamada: Qualquer elemento div com a classe 'dialog_alert_question_pendente_revisao'
     */
    $( "[name=dialog_alert_question_pendente_revisao]" ).dialog({
       position: 'center',
       closeOnEscape: true,
       resizable: false,
       autoOpen: false,
       show: "blind",
       modal: true,
       width: 600,
       buttons: {
                    "Não": function() {
                     $( this ).dialog( "close" );
                    },

                    "Sim": function() {

                       // qual app esta rodando
                       var url = window.location.pathname.split('/');
                       app = url[2];

                       // check box
                       desmarcar_todas();

                       $('input[id=4]').each(function(){
                            $(this).attr('checked','checked');
                            // encerrar
                            $.get("/" + url[1] + '/' + app + '/selecao/' + this.value + "/encerrar/jq/", function(data){
                                // alterar HTML funcao
                                callback(data);
				avaliadores_id = data.split(':')[0];
				$('#'+avaliadores_id).hide();
                            });
                           $.dialogs.success('Encerrado com sucesso!');
                       });

                       // finaliza
                       desmarcar_todas();
                       $( this ).dialog( "close" );
                    }
                }
    });


	/*
	 * Objetivo: Caixa de diálogo para mostrar o conceito da competênica técnica
	 * Utilização: Avaliação Técnica e NCF Técnico
	 */
    $("[name*=dialog_auto]").dialog({
       resizable: false,
       autoOpen: false,
       show: "blind",
       modal: false,
       width: 500
    });


   /*
    * ======= AVALIAÇÃO COMPORTAMENTAL DE CONSENSO ==============
    */



    /*
     * Objetivo: Caixa de diálogo para confirmação se deseja salvar a avaliação de consenso mesmo sem finalizá-la.
     * Utilização: avaliação comportamental de consenso
     * Chamada: Mostra a div com o nome 'dialog_encerrar_aval'
     */
	$('div[name=dialog_encerrar_aval]').dialog({
       position: 'center',
       closeOnEscape: true,
       resizable: false,
       autoOpen: false,
       show: "blind",
       modal: true,
       width: 600,
       buttons: {
                "Não": function() {
                 $( this ).dialog( "close" );
                },

                "Sim": function() {
                	$( this ).dialog( "close" );
                	$('#form_consenso').submit();
                }
           }
       });



	/*
	 * Objetivo: Caixa de diálogo para confirmar saída do usuário quando clica em cancelar na avaliação de consenso.
	 * Utilização: avaliação comportamental de consenso
	 * Chamada: Mostra a div como nome 'dialog_cancelar_aval'
	 */
	$('div[name=dialog_cancelar_aval]').dialog({
       position: 'center',
       closeOnEscape: true,
       resizable: false,
       autoOpen: false,
       show: "blind",
       modal: true,
       width: 600,
       buttons: {
                "Não": function() {
                 $( this ).dialog( "close" );
                },

                "Sim": function() {
                	$( this ).dialog( "close" );
					return $(window).attr("location","/coleta/avalc_consenso/selecao");
                }
            }
       });


	/*
	 * ===== AVALIAÇÃO COMPORTAMENTAL =====
	 */

    /*
     * Objetivo: Caixa de diálogo para confirmação de encerrar a avaliação sem responder as questões aberta
     * Utilização: Avaliação Comportamental
     */

       $("[for='id_username']").remove();


}); //fim
