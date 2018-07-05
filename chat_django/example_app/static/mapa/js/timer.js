
var interval;
var seg = null;
var $timer_min = null;
var timer_sec = null;

function start_timer() {
    var i = seg;
    clearInterval(interval);
    interval = setInterval(function() {
        i--;
        $('.chart').data('easyPieChart').update(get_time_percent(seg, i));
        set_timer(i);
        if (i == 0) {
            clearInterval(interval);
            save_dialog();
        }
    }, 1000);
}

function set_timer(sec) {
    $timer_min.text(parseInt(sec / 60));
    var format = "0" + (sec % 60);
    $timer_sec.text(format.substring(format.length - 2));
}

function get_time_percent(total, current) {
    return parseInt((current / total) * 100);
}

function save_dialog() {
    $("#dialog-save").dialog({
        title: "Salvar mapa",
        buttons: [{
                text: "Salvar depois",
                class: "btn btn-sm",
                click: function() {
                    start_timer();
                    $(this).dialog("close");
                }
            },
            {
                text: "Salvar",
                class: "btn btn-sm btn-primary",
                click: function() {
                    mostrarCarregando();
                    start_timer();
                    $(this).dialog("close");
                    map.save(false, function(e) {
                        esconderCarregando();
                        start_timer();
                        if (e == undefined || !e.has_error) recarregar_tela();
                        else get_atribuicao_padrao();
                    });
                }
            }
        ]
    })
};
