
var TABELA_CONSULTA = undefined;

function excluirFeedback(id) {
    var id_feedback = id;
    $.dialogs.confirm(TITULO_DELETE_DIALOG, function() {
        $.ajax({
            url: URL_EXCLUIR_FEEDBACK,
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                id: id_feedback
            },
            success: function(dados) {
                $.dialogs.success(MSG_DELETE_DIALOG)
                consultar();
            },
            complete: function() {
                esconderCarregando();
            },
        });
    });

};

function criar_lista_feedback_colab(){

  TABELA_CONSULTA = $.DataTableXenon({
  	json : URL_CONSULTA_FEEDBACK_COLAB,
  	container: "datatable_feedback_colab",
    filterForm: '#filtro_consulta',
    aoColumns: [
       {
         "mData": TITULO_DATA,
         'orderable': true,
         'searchable': true,
         'class':'col-md-1 text-center  hidden-xs',
         "mRender": function ( data, type, full ) {
             if (full["data_ocorrencia"]) {
               return ' <span class="hidden">' + full["data_ocorrencia_us"] + '</span>' +
                 full["data_ocorrencia"];
             } else {
               return ""
             }
           }
	 },
       {
         "mData": TITULO_FEEDBACK,
         'orderable': true,
         'searchable': true,
         'class':'col-md-6',
         "mRender": function ( data, type, full ) {
           return full['observacao'] +
           '  <span class="hidden-md-up"><b><br>'+TITULO_DATA+':</b>&nbsp;' +  full["data_ocorrencia"] + '</span> '+
           '  <span class="hidden-md-up"><b><br>'+TITULO_TIPO+':</b>&nbsp;' +  full["motivo"] + '</span> ';
         }
	 },
       {
         "mData": TITULO_ACOES,
         'orderable': false,
         'searchable': false,
         'class':'col-md-1 text-center big_icons',
         "mRender": function ( data, type, full ) {

         var HTML = "";
         if(TEM_PERMISSAO_EDITAR){
             HTML += '<a href="'+URL_EDICAO+full["feedback_id"]+'/" title="'+TITULO_EDIT+'" class="text-gray">'
                  +' <i class="'+ICONES_EDIT+'"></i>'
                  +'</a>';
         }
         HTML += '<a href="#" onclick="excluirFeedback('+full["feedback_id"]+')" title="'+TITULO_DELETE+'" class="text-gray">'
         +' <i class="'+ICONES_DELETE+'"></i>'
         +'</a>';

         return HTML;
         }
	 },
   ]
  });
}

function consultar(){
  TABELA_CONSULTA.reload();
}

$(function() {
    criar_lista_feedback_colab();
});

$("#filtrar").click(function(e) {
  e.preventDefault
  consultar();
});
