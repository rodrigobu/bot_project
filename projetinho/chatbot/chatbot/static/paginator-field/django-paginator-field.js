(function ($) {
    $.fn.paginator = function (options) {
        var field = $(this),
            settings = $.extend({
                    filters: '',
                    on_success: function () {},
                    page: 1,
                    //target: field,
                    url: ''
                },
                $.extend(field.data('paginator') || {}, options)
            );
        field.data('paginator', settings);
        //settings.target.scroll(function () {
            var obj = $(this),
                //max_height = (this.scrollHeight - this.offsetHeight),
                settings_ = obj.data('paginator'),
                data = {
                    paginator_field_name: obj.prop('name'),
                    paginator_field_page: settings_.page + 1
                };
            //if (($(this).scrollTop() + 10) > max_height) {
                $.get(settings_.url, $.param(data) + '&' + $(settings_.filters).serialize(),
                    function (response) {
                        teste = response;
                        if (response) {
                            settings_.page += 1;
                            obj.data('paginator', settings_);
                            $.each(response, function (index, option) {
                                var options_ = obj.find('option').map(function (index, option_) {
                                        return $('<div>').append($(option_).clone()).html();
                                    }),
                                    exists = options_.filter(function (index, text) {
                                        return text == option;
                                    }).length > 0;
                                if (!exists) {
                                    obj.append($(option));
                                };
                            });
                        };
                        settings.on_success(obj);
                    }
                );
            //};
        //});
        return this;
    };
}(jQuery));