function copyform(template){
    var new_form = template.clone(false),
        form_objs = new_form.find('*'),
        change_attrs = ['id', 'name', 'for'],
        separator = '<hr class="hr hr-dotted" width="100%"/>',
        actions = '\
            <div class="action-buttons col-xs-12">\
                <a href="javascript:void(0)" class="red pull-right exclude-button">\
                    <i class="ace-icon fa fa-trash-o bigger-120" title="Excluir"></i> Excluir \
                </a>\
            </div>',
        max_add = 5;

    var count = template.data('copycount');
        count = count == undefined ? 2 : count += 1;

    if (count <= max_add) {
        template.data('copycount', count);
        var unique = template.data('copyunique');
        unique = unique == undefined || unique < 2 ? 2 : unique += 1;
        template.data('copyunique', unique);

        $.each(form_objs, function () {
            var obj = $(this);
            $.each(change_attrs, function () {
                var att = this,
                    attr = obj.prop(att);
                if (attr) {
                    obj.prop(att, attr.replace(/(\d+)/, unique));
                };
            });
        });

        form_objs.find('input, select, textarea').val(null);
        new_form = $('<div id="template_' + unique + '">').append(new_form.html());
        template.parent().append(new_form);
        new_form.before(separator);
        actions = $(actions);
        actions.find('.exclude-button').on('click', function () {
            new_form.prev().remove();
            new_form.remove();
            template.data('copycount', template.data('copycount') - 1);
        });
        new_form.prepend(actions);
        return new_form;
    };
};