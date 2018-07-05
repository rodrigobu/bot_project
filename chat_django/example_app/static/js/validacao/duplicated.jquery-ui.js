;( function($, window, undefined) {
        var pluginName = 'isDuplicated', defaults = {
            content : null,
            events : 'blur',
            minLength : 0,
            model : [],
            filters : {},
            async:true,
            afterGet : function() {
            },
            afterSuccess : function() {
            },
            ajaxOptions : {
                url : "/validar/valida_duplicidade/",
                type : 'get',
                dataType : 'json',
                contentType : "application/json; charset=utf-8",
                beforeSend : function() {
                    mostrarCarregando();
                },
                error : function(jXHR, textStatus, errorThrown) {
                    exibirErro(null, "" + jXHR + " " + textStatus + " " + errorThrown);
                },
                success : function() {
                },
                complete : function() {
                    esconderCarregando();
                },
            }
        };

        function Plugin(element, options) {
            this.element = $(element);
            this.options = $.extend({}, defaults, options);
            this.init();
        }

        Plugin.prototype.init = function() {
            var callback = {}, pttp = this, o = pttp.options;
            OPTIONS = o;
            $(pttp.element).addClass('vErrorDuplicated');
            if (o.events == 'load') {
                pttp.GET(pttp);

            } else {
                if ($.isArray(o.events)) {
                    $.each(o.events, function() {
                        callback[this] = function() {
                            pttp.GET(pttp)
                        };
                    });
                    $(this.element).on(callback);

                } else {
                    $(pttp.element).on(o.events, function() {
                        pttp.GET(pttp)
                    });
                };
            }
        };

        Plugin.prototype.createDataFilter = function() {
            var objtext = "{", pttp = this, o = pttp.options;

            if ($.isPlainObject(o.filters)) {
                $.each(o.filters, function(k, v) {
                    if (v == '#') {
                        v = $(pttp.element).val()
                    };
                    objtext += "'" + k + "':'" + v + "', ";
                });
                objtext += "}";
                return objtext;
            } else {
                return
            };
        };

        Plugin.prototype.GET = function(pttp) {

            var o = pttp.options, ajaxOptions = $.extend(true,{}, o.ajaxOptions, {
                data : {
                    filters : pttp.createDataFilter(),
                    model : o.model
                },
                success : function(r) {
                    pttp.valid = false;
                    if (r.result != true) {
                        $(pttp.element).removeClass('vErrorDuplicated');
                        pttp.valid = true;
                    } else {
                        $(pttp.element).addClass('vErrorDuplicated');
                        pttp.valid = false;
                    };

                    pttp.validate();

                    if ($.isFunction(o.afterSuccess)) {
                        o.afterSuccess(pttp);
                    };
                },
            });

            if ($(pttp.element).val() != null && $(pttp.element).val().length > o.minLength) {
                $.ajax(ajaxOptions);
            };
        };

        Plugin.prototype.validate = function() {
            var pttp = this, o = pttp.options;

            if (pttp.valid == false) {
                $(pttp.element).closest('p').addClass('vErro');
                $(pttp.element).qtip({
                    content : o.content || 'Já existe o registro "<i>' + $(pttp.element).val() + '</i>".<br /> Modifique-o, pois este não pode ser duplicado.',
                    style : 'qtip-red qtip-shadow',
                    position : {
                        my : 'top center',
                        at : 'bottom center',
                        target : $(pttp.element),
                    },
                });

                $('html, body').animate({
                    scrollTop : $(pttp.element).height() + 50
                });

            } else {
                $(pttp.element).closest('p').removeClass('vErro');
                $(pttp.element).qtip('destroy');
            };
        };

        // Prevent against multiple instantiations
        $.fn[pluginName] = function(options) {
            return this.each(function() {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            });
        };
    }(jQuery, window));
