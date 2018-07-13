
$(function(){
	$(".form-status .widget-body:first").prepend('\
        <ul class="" id="">\
            <li class="">\
                <a data-toggle="t" href="#checklist">Tarefas da Etapa</a>\
            </li>\
            <li class="active">\
                <a data-toggle="t" href="#map_comp">Estatísticas</a>\
            </li></ul>');
	$("#highcharts-0").css({"clear":'both'}).after('<div class="tab-pane" id="checklist">\
    </div>\
    <div class="tab-pane" id="infos">\
        <div >\
        </div>\
    </div>').after("</div>");
    
    $(".form-status .widget-body:eq(1)").prepend('\
	        <ul class="nav nav-tabs" id="">\
	            <li class="">\
	                <a data-toggle="tab" href="#checklist2">Tarefas da Etapa</a>\
	            </li>\
	            <li class="active">\
	                <a data-toggle="tab" href="#map_tec">Estatísticas</a>\
	            </li> </ul>');
    $("#highcharts-2").after('<div class="tab-pane" id="checklist2">\
    </div>\
    <div class="tab-pane" id="infos2">\
        <div>\
        </div>\
    </div>').after("</div>");
    $(".form-status .widget-body:eq(2)").prepend('\
	        <ul class="nav nav-tabs" id="">\
	            <li class="">\
	                <a data-toggle="tab" href="#checklist3">Tarefas da Etapa</a>\
	            </li>\
	            <li class="active">\
	                <a data-toggle="tab" href="#map_resp">Estatísticas</a>\
	            </li></ul>');
    $("#highcharts-4").after('<div class="tab-pane" id="checklist3">\
    </div>\
    <div class="tab-pane" id="infos3">\
        <div>\
        </div>\
    </div>').after("</div>");
    $(".alert").hide();
    $(".form-status .widget-body:first").tabs();
    $(".form-status .widget-body:eq(1)").tabs();
    $(".form-status .widget-body:eq(2)").tabs();
    $("#infos_insert1").appendTo($("#infos"));
    $("#infos_insert2").appendTo($("#infos2"));
    $("#infos_insert3").appendTo($("#infos3"));
    $($(".widget-main")[0]).prepend('<div id="checklist"></div>');
    $($(".widget-main")[1]).prepend('<div id="checklist2"></div>');
    $($(".widget-main")[2]).prepend('<div id="checklist3"></div>');
    $("#tasks1").appendTo("#checklist");
    $("#tasks2").appendTo("#checklist2");
    $("#tasks3").appendTo("#checklist3");
    $(".highcharts-container").removeClass("ui-tabs-panel");
    $("#checklist").css("padding","0px").css("border","none");
    $("#checklist3").css("padding","0px").css("border","none");
    $("#checklist2").css("padding","0px").css("border","none");
    $(".form-status fieldset").hide();
    $("#map_comp").css("min-height","433px");
    $("#map_tec").css("min-height","433px");
    $("#map_resp").css("min-height","433px");
    $(".link_graficos").parent().css("left","50px");
    
    
		$("#next_etapa").bind('click', function() {
			$.dialogs.confirm('Confirmação', "Deseja avançar para a próxima etapa?",  function(r) {
				if (r) {
					$.ajax({
						url      : URL_PROXIMA_ETAPA,
						dataType : 'json',
						type     : 'get',
						data     : { },
						success : function(retorno) {
							if (retorno.status == 'ok') {
								window.location = get_entire_path_windows();
							} else {
								$.dialogs.error(retorno.msg);
							}
						},
					});
				};
			});
		});
    
});