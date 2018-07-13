( function ($) {

    reload_djflexgrid = function (container, page) {
        container = $(container);
        var settings = container.data('djflexgrid');

        settings.beforeLoad();
        if (settings.use_pagination_cache.enabled) {
            settings.methods._create_cache();
        }
        ;

        var ajax_data = {
            page: page || $(container).find('table.ajax_list>tfoot .current_page').val() || 1 // if no page was passed, reloads the current page
        };

        // sorting
        var selected_order = $(container).find('table.ajax_list>thead>tr>th.active_sort');
        if (selected_order.length) {
            var order = selected_order.data('order-field');
            if (selected_order.hasClass('ajax_list_sorter_desc'))
                order = '-' + order;
            ajax_data['order_by'] = order;
        }
        ;

        ajax_data = $.param(ajax_data);

        if (settings.filter_form) {
            ajax_data += '&' + $(settings.filter_form).serialize();
        }
        ;

        ajax_data += '&per_page=' + ($(container).find('.choose-per-page select').val() || '');

        $.ajax({
            url: settings.url || settings.list_url,
            method: 'get',
            cache: false,
            data: ajax_data,
            dataType: 'html',
            beforeSend: function () {
                $.loading.hide();
                $(container).html(
                    '<div class="center text-muted"> \
                        <div class="space-8"></div> \
                        Carregando... <i class="fa fa-spinner fa-spin bigger-150"></i>\
                        <div class="space-8"></div> \
                    </div>'
                );
            },
            success: function (data, textStatus, jqXHR) {
                $(container).html(data);
                if (settings.use_pagination_cache.enabled) {
                    //settings.methods._update_cache();
                }
                ;
                settings.successLoad(data, textStatus, jqXHR);
                $(container).find('.choose-per-page select').on('change', function(){
                    reload_djflexgrid(container);
                });
                if (settings.filter_form != null && settings.filter_form && settings.filter_form.length > 0){
                    $(settings.filter_form).find('input:text').on('keypress', function(){
                        var input_text = $(this);
                        if (input_text.val().length > 0){
                            if ($(settings.filter_form).find('.clear-form').length > 0){
                                return;
                            }else{
                                $(settings.filter_form).append(
                                    '<i class="ace-icon clear-form fa fa fa-times bigger-115 blue" title="Limpar" style="cursor: pointer;"/>'
                                );
                                $(settings.filter_form).find('.clear-form').click(function(){
                                    $(settings.filter_form).find('input:text').val(null);
                                    $(settings.filter_form).find('.clear-form').next('.tooltip').remove();
                                    $(settings.filter_form).find('.clear-form').remove();
                                    settings.methods.reload();
                                });
                            };
                        };
                    });
                };
            },
            error: function (jqXHR, textStatus, errorThrow) {
                /*$(container).html('<b>Error loading list.</b>');
                $(container).append('<br/><b>Error type:&nbsp;</b><span>' + textStatus + '</span>');
                if (errorThrow)
                    $(container).append('<br/><b>Error:&nbsp;</b><span>' + errorThrow + '</span>');
                settings.errorLoad(jqXHR, textStatus, errorThrow);*/
                $(container).html('<b>Erro ao carregar listagem.</b>');
                $(container).append('<br/><b>Tipo do Erro:&nbsp;</b><span>' + textStatus + '</span>');
                if (jqXHR.responseText.split("\n")[1]=='')
                    $(container).append('<br/><b>Erro:&nbsp;</b><span>' + errorThrow + '</span>');
                $(container).append('<br/><b>Erro:&nbsp;</b><span>' + jqXHR.responseText.split("\n")[1] + '</span>');
                settings.errorLoad(jqXHR, textStatus, errorThrow);
            },
            complete: function (jqXHR, textStatus) {
                $.loading.hide();
                settings.completeLoad(jqXHR, textStatus);
            }
        });
    };

    function export_to(container, export_to) {
        container = $(container);
        var settings = container.data('djflexgrid'),
            data = {
                // if no page was passed, reloads the current page
                page: $(container).find('table.ajax_list>tfoot .current_page').val() || 1
            };
        // sorting
        var selected_order = $(container).find('table.ajax_list>thead>tr>th.active_sort');
        if (selected_order.length) {
            var order = selected_order.data('order-field');
            if (selected_order.hasClass('ajax_list_sorter_desc'))
                order = '-' + order;
            data['order_by'] = order;
        }
        ;
        data = $.param(data);
        if (settings.filter_form) {
            data += '&' + $(settings.filter_form).serialize();
        }
        ;
        data += '&export=' + export_to;
        data += '&per_page=' + ($(container).find('.choose-per-page select').val() || '');
        open((settings.url || settings.list_url) + '?' + data);
    };

    $.fn.djflexgrid = function (options) {
        var settings = $.extend({
            url: null,
            list_url: null,
            filter_form: '',
            filter_button: '',
            use_contextmenu: true,
            use_pagination_cache: {
                enabled: true,
                select_columns: '0'
            },
            beforeLoad: function () {
            },
            successLoad: function (data, textStatus, jqXHR) {
            },
            errorLoad: function (jqXHR, textStatus, errorThrow) {
            },
            completeLoad: function (jqXHR, textStatus) {
            }
        }, options);

        var container = this;
        container.data('djflexgrid', settings);

        settings._cache = new Object;
        settings.methods = new Object;
        settings.methods.reload = function () {
            reload_djflexgrid(container);
            return settings;
        };
        settings.methods.load_page = function (page) {
            reload_djflexgrid(container, page);
            return settings;
        };
        settings.methods._create_cache = function () {
            if (settings.use_pagination_cache.enabled) {
                var trs = $(container).find('table > tbody > tr').not(':hidden'),
                    columns = settings.use_pagination_cache.select_columns.split(',');
                if (columns.length > 0) {
                    $.each(trs, function (index, tr) {
                        var obj = $(tr),
                            tds = new Object;
                        $.each(columns, function (index, n) {
                            var td = obj.find('td:eq(' + n + ')');
                            if (td.find('input[type=checkbox]').length > 0) {
                                if (td.find('input[type=checkbox]').is(':checked')) {
                                    td.find('input[type=checkbox]').attr('checked', true);
                                } else {
                                    td.find('input[type=checkbox]').removeAttr('checked', true);
                                }
                                ;
                            }
                            ;
                            tds[n] = td.html();
                        });
                        settings._cache[obj.attr('cache-id')] = tds;
                    });
                }
                ;
            }
            ;
            return settings._cache;
        };
        settings.methods._update_cache = function () {
            if (settings.use_pagination_cache.enabled && settings._cache) {
                $.each(settings._cache, function (key, columns) {
                    var tr = $(container).find('[cache-id=' + key + ']');
                    $.each(columns, function (n, value) {
                        tr.find('td:eq(' + n + ')').html(value);
                    });
                });
            }
            ;
        };

        // FILTER
        if (settings.filter_form) {
            if (settings.filter_button) {
                $(document).on('click', settings.filter_button, function (event) {
                    reload_djflexgrid(container);
                });
            } else {
                $(document).on('submit', settings.filter_form, function (event) {
                    reload_djflexgrid(container);
                    return false;
                });
            }
            ;
        }
        ;

        // SORTING
        $(container).off('click', 'table.ajax_list>thead>tr>th.ajax_list_sorter');
        $(container).on('click', 'table.ajax_list>thead>tr>th.ajax_list_sorter', function (event) {
            var th = $(this);
            var cls_asc = 'ajax_list_sorter_asc', cls_desc = 'ajax_list_sorter_desc', cls_active = 'active_sort';

            $('table.ajax_list>thead>tr>th.ajax_list_sorter').not(th).removeClass(cls_asc + ' ' + cls_desc + ' ' + cls_active);

            if (!(th.hasClass(cls_asc) || th.hasClass(cls_desc))) {// no sort -> asc
                th.addClass(cls_asc + ' ' + cls_active);
            } else if (th.hasClass(cls_asc)) {// asc -> desc
                th.removeClass(cls_asc);
                th.addClass(cls_desc + ' ' + cls_active);
            } else if (th.hasClass(cls_desc)) {// desc -> asc
                th.removeClass(cls_desc);
                th.addClass(cls_asc + ' ' + cls_active);
            }
            reload_djflexgrid(container, 1);
        });

        // PAGINATION
        $(container).off('click', 'table.ajax_list>tfoot .ajax_list_page, table.ajax_list  .ajax_list_page');
        $(container).on('click', 'table.ajax_list>tfoot .ajax_list_page, table.ajax_list  .ajax_list_page', function (event) {
            var page = $(this).data('page-number');
            reload_djflexgrid(container, page);
        });

        reload_djflexgrid(container);

        // EXPORT
        $(container).off('click', '.export_list [export]');
        $(container).on('click', '.export_list [export]', function () {
            $($.loading.show()).stop(
                export_to(container, $(this).attr('export'))
            ).stop($.loading.hide());
        });

        if (settings.use_contextmenu && $.enable_contextmenu) {
            try {
                $(container).contextmenu({
                    width: 200,
                    show: 'fade',
                    preventContextMenuForPopup: true,
                    preventSelect: true,
                    menu: [
                        {
                            title: 'Recarregar', uiIcon: 'ui-icon-refresh',
                            action: function () {
                                $(container).data('djflexgrid').methods.reload();
                            }
                        },
                        {title: 'Ordenar por', uiIcon: 'ui-icon-arrowthick-2-n-s', children: [
                            { title: "id", uiIcon: 'ui-icon-arrowthick-2-n-s' },
                            { title: "Descrição", uiIcon: 'ui-icon-arrowthick-2-n-s'}
                        ]}
                    ],
                    select: function (event, ui) {
                    },
                    beforeOpen: function (event, ui) {
                    }
                });
            } catch (e) {
                console.log('Houve um erro ao iniciar o menu de contexto da flexgrid: "' + e + '"');
            }
            ;
        }
        ;

        return this;
    };

}(jQuery));
$(function(){
	$("#div_id_per_page label").css({"vertical-align":"super"});
});
