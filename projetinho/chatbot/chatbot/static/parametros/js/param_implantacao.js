var validar_config_email = function() {
  var to_return = true;
  $.ajax({
    url: URL_SALVAR_ABAS,
    dataType: 'json',
    type: 'post',
    data: data,
    async: false,
    success: function(retorno) {
      if (retorno["status"] == "ok") {
        to_return = true;
      } else {
        to_return = false;
        $.dialogs.error("Configuração de servidor de e-mails inválida.");
      }
    }
  });
  return to_return;
};

$(function() {

  if (SUCESSO) {
    $.dialogs.success("Parâmetros salvos com sucesso.");
  }

  $("#submit_form").live('click', function(e) {
    mostrarCarregando();
    //-- Validação
    if (!validar_campos_obrigatorios()) {
      esconderCarregando();
      return false;
    }
    //-- validações especificas
    if ($("#id_chave_cliente").val().length < 8) {
      clean_errors_field("id_chave_cliente");
      var num = $("#id_chave_cliente").val().length;
      gerate_error("id_chave_cliente", "Certifique-se de que o valor tenha 8 caracteres (ele possui " + num + ")");
      $.dialogs.error("Existem erros no preenchimento do formulário.");
      esconderCarregando();
      return false;
    }
    if ($("#id_chave_cliente"))
      //-- Valida E-mail
      if (!valida_email("id_serveremail_user") || !valida_email("id_email_rh")) {
        valida_email("id_email_rh");
        $.dialogs.error("Existem erros no preenchimento do formulário.");
        esconderCarregando();
        return false;
      }
    $("#formulario-config_geral").submit();
  });

  $("#teste_email").live("click", function() {
    enviar_email_teste();
  });

  $("div .checkbox:not(input) label").parent().parent().removeClass("form-group").addClass("form-inline");

  $("[value='nome']").addClass("always_visible");
  $("[value='funcao']").addClass("always_visible");

  var adjustment;
  $("ol.simple_with_animation").sortable({
    group: 'simple_with_animation',
    pullPlaceholder: false,
    // animation on drop
    onDrop: function  ($item, container, _super) {
      var $clonedItem = $('<li/>').css({height: 0});
      $item.before($clonedItem);
      $clonedItem.animate({'height': $item.height()});

      $item.animate($clonedItem.position(), function  () {
        $clonedItem.detach();
        _super($item, container);
      });
    },
    // set $item relative to cursor position
    onDragStart: function ($item, container, _super) {
      var offset = $item.offset(),
          pointer = container.rootGroup.pointer;

      adjustment = {
        left: pointer.left - offset.left,
        top: pointer.top - offset.top
      };

      _super($item, container);
    },
    onDrag: function ($item, position) {
      $item.css({
        left: position.left - adjustment.left,
        top: position.top - adjustment.top
      });
    }
  });

  $("#formulario-config_geral").append($("#config_layout"));

  $("#formulario-config_geral").submit(function(){
      var campos_selecionados = [];
      $.each( $("#sortable_campos_layout input"), function(idx, value){
        campos_selecionados.push( $(value).val() )
      });
      $("#id_campos_layout").val( campos_selecionados );
  });


});
