// Carregando
var GIF_CARREGANDO = '<img src="/static/images/loading_icon.gif" style="width: 30px;">';
var mostrarCarregando = function(msg) {
	$.blockUI({
		message : msg ? GIF_CARREGANDO+ '<b>' + msg + '</b>' : GIF_CARREGANDO+'Processando, por favor aguarde...'
	});
};
var esconderCarregando = function() {
	$.unblockUI();
};

var get_base_path_windows = function() {
	pathArray = window.location.href.split('/');
	protocol = pathArray[0];
	host = pathArray[2];
	url = (protocol != '' ? (protocol + '//') : "") + host;
	return url;
};
var get_path_windows_without_parans = function() {
	return window.location.href.split('?')[0];
};
var get_entire_path_windows = function() {
	return window.location.href;
};
