var TableObject = function(el, data, context, save_url, after_save){
    'use strict';
    // For run fast this not use jQuery, el is a DOM object

    var scope = this;               // Scope object
    var model = scope.model = new TableObjectModel(data);  // The data model
    var event_data = {};            // data used in events
    var save_interval = null;       // Timeout of save
    var _check_for_save = false;
    var menu = context.children[0];
    var tds = [];                   // (Cache) tds created
    var menu_binded = false;

    // -------------------------------------------------------------------
    // DOM Fragments
    // -------------------------------------------------------------------
    var tbodyFragment = document.createDocumentFragment();
    var theadFragment = document.createDocumentFragment();

    // -------------------------------------------------------------------
    // Callbacks
    // -------------------------------------------------------------------
    scope.renderCallback = function(){};

    // Add header groups
    var add_groups = function(){
        var h = data['headers'];
        var tr = document.createElement('tr');
        tr.className = 'groups';
        var colSpan = 0;

        for(var i in h){
            // Create th
            var th = document.createElement('th');
            if(h[i]['type'] === 'col'){
                colSpan++;
            }else{
                if(colSpan > 0){
                    // Add no group td
                    th.className = 'no-group';
                    th.colSpan = colSpan;
                    tr.appendChild(th);
                }

                var thGroup = document.createElement('th');
                thGroup.innerHTML = h[i]['title'];
                thGroup.style.background = h[i]['color'];
                thGroup.colSpan = h[i]['values'].length;

                tr.appendChild(thGroup);
                colSpan = 0;
            }
        }

        theadFragment.appendChild(tr);
    };

    // Add header
    var add_header = function(){
        var h = data['headers'];
        var tr = document.createElement('tr');

        for(var i in h){
            if(h[i]['type'] === 'col'){
                var th = document.createElement('th');
                th.innerHTML = h[i]['title'];
                th.className = h[i]['class'];
                th.style.background = h[i]['color'];
                tr.appendChild(th);
            }else{
                // Add inner group header
                for(var j in h[i]['values']){
                    var th = document.createElement('th');
                    th.innerHTML = h[i]["values"][j]['title'];
                    th.className = h[i]["values"][j]['class'];
                    th.style.background = h[i]["values"][j]['color'];
                    tr.appendChild(th);
                }
            }
        }
        theadFragment.appendChild(tr);
        el.children[0].appendChild(theadFragment);
    };

    var get_row_span = function(ref, c){
        if(!model.has_tree(ref))
            return 1;

        var last = ref;
        var next = ref;
        var ht = true;
        while(ht && (next = model.get_next(next))){
            if(model.has_tree())
                last = next;
            else
                ht = false;
        }

        return model.count_refs(ref, last, c);
    };

    var input_add_original_data = function(){
        if(this.myScope.value.original_value == undefined)
            this.myScope.value.original_value = $.extend({}, this.myScope.value);
    }
    var input_change_value = function(){
        if(this.type == 'checkbox')
            this.myScope.value[this.name] = this.checked;
        else
            this.myScope.value[this.name] = this.value;
    };

    var check_for_save = function(){
        if(_check_for_save){
            //scope.save(true);
            _check_for_save = false;
        }
    };

    var set_content = scope.set_content = function(new_content){
        data = new_content;
    };

    var add_values = function(c, td){
        var trScope = td.parentNode.scope;
        for(var key in c.value){
            var input = td.querySelectorAll('[name=' + key + ']');

            if(input.length){
                input[0].myScope = td.myScope;

                if(!trScope.readonly){
                    input[0].addEventListener('keyup', input_change_value);
                    input[0].addEventListener('keypress', input_change_value);
                    input[0].addEventListener('change', input_change_value);
                    input[0].addEventListener('blur', input_change_value);
                    input[0].addEventListener('blur', check_for_save);
                    input[0].addEventListener('focus', input_add_original_data);
                    input[0].addEventListener('focus', input_change_value);
                    if(input[0].onload){
                        input[0].onload();
                    }
                }else{
                    input[0].disabled = 'disabled';
                }

                if(input[0].type=='text' || input[0].type=='password' || input[0].type=='email' ||
                    input[0].type=='url' || input[0].tagName == 'SELECT')
                    input[0].value = c.value[key] || "";
                else if(input[0].tagName == 'TEXTAREA' || input[0].tagName == 'DIV')
                    input[0].innerHTML = c.value[key] || "";
                else if(input[0].type = 'checkbox')
                    input[0].checked = c.value[key] || "";

            }
        }
    };

    var menu_actions = {
        add: function(){
            var td = event_data['td'];
            $(td).attr("resetado",false);
            // var add = td.myScope[model.get_next(td.ref)][0];
            var line = model.complete_line(model.get_next(td.ref))[0];
            td.myScope[model.get_next(td.ref)].push(line);
            scope.render();
        },
        remove: function(){
            model.remove_line(event_data['td'].ref, event_data['td'].myScope);
            scope.render();
        },
        clean: function(){
            var td = event_data['td'];
            $(td).attr("resetado",true);
            for(var i in td.myScope.value){
                if(i != '_pk'){
                    td.myScope.value[i] = null;
                }
            }
            scope.render();
        },
        to_up: function(){
            var td = event_data['td'];
            var list = td.getParentList();

            for (var i = 0; i < list.length; i++) {
                if (list[i] == td.myScope) {
                    var tmp = list[i];
                    list[i] = list[i-1];
                    list[i-1] = tmp;
                    scope.render();
                    return;
                }
            }
        },
        to_down: function(){
            var td = event_data['td'];
            var list = td.getParentList();

            for (var i = 0; i < list.length; i++) {
                if (list[i] == td.myScope) {
                    var tmp = list[i];
                    list[i] = list[i+1];
                    list[i+1] = tmp;
                    scope.render();
                    return;
                }
            }
        }
    };

    var menu_events = function(menu){
        if(!menu_binded){
            menu_binded = true;
            var items = menu.querySelectorAll('[data-action]');
            for(var i=0; i < items.length; i++){
                items[i].addEventListener('click', function(e){
                    menu_actions[this.getAttribute('data-action')]();
                    menu.style.display = 'none';
                });
            }
        }
    };

    var add_events = function(td){
        td.addEventListener('click', function(e){
            var input = this.querySelectorAll('input, select, textarea');
            if(input.length === 1)
                input[0].focus();
        });
        var scope = td.myScope;

        if(!scope.readonly)
            td.addEventListener('contextmenu', function(e){
                e.preventDefault();

                td.add_context_function = true;

                menu.style.display = 'block';
                menu.style.position = 'absolute';

                menu.style.top = (document.documentElement.scrollTop + e.clientY - 10) + 'px';
                menu.style.left = (document.documentElement.scrollLeft + e.clientX - 10) + 'px';

                var add = menu.querySelectorAll('[data-action=add]')[0];
                var next = model.get_next(td.ref);

                if(next && model.has_tree(td.ref)){
                    add.style.display = 'block';
                    add.innerHTML = 'Adicionar ' + model.get_title(next);
                }else{
                    add.style.display = 'none';
                }

                var send_to = document.getElementById('send_to');
                var send_to_options = document.getElementById('send_to_options');

                if(model.can_change_parent(td.ref)){
                    send_to_options.innerHTML = '';
                    var options = model.change_parent_options(td.ref, td.myScope);

                    for(var i in options){
                        var li = document.createElement('li');
                        var a = document.createElement('a');

                        a.addEventListener('click', function(){
                            model.change_parent(event_data['td'].ref, event_data['td'].myScope, this.send_to);
                            render();
                        });

                        a.innerHTML = options[i].label;
                        a.send_to = options[i].obj;

                        li.appendChild(a);
                        send_to_options.appendChild(li);
                    }

                    send_to.style.display = 'block';
                }else{
                    send_to.style.display = 'none';
                }


                var to_up = menu.querySelectorAll('[data-action=to_up]')[0];
                var to_down = menu.querySelectorAll('[data-action=to_down]')[0];
                var list = td.getParentList();

                to_up.style.display = 'block';
                to_down.style.display = 'block';

                if(list.length <= 1){
                    to_up.style.display = 'none';
                    to_down.style.display = 'none';
                }else{
                    if(list[0] === td.myScope){
                        to_up.style.display = 'none';
                    }
                    if(list[list.length - 1] === td.myScope){
                        to_down.style.display = 'none';
                    }
                }


                var remove = menu.querySelectorAll('[data-action=remove]')[0];

                if(td.myScope.parent[td.ref] && td.myScope.parent[td.ref].length > 1){
                    remove.style.display = 'block';
                }else if(td.myScope.parent[td.ref] == undefined && data['content'][model.get_first_ref()].length > 1){
                    remove.style.display = 'block';
                }else{
                    remove.style.display = 'none';
                }

                event_data['td'] = this;
            });
    };

    var render_line = function(ref, c, tr, group){
        group = group || false;

        if(!tr){
            tr = document.createElement('tr');
            tr.scope = c;
            if(tr.scope.readonly)
                tr.className = tr.className + " disabled";
        }

        // Javascript don't append duplicated elements
        tbodyFragment.appendChild(tr);
        var next = model.get_next(ref);

        var td = document.createElement('td');
        td.innerHTML  = model.get_field(ref);

        // Add scopes
        td.lineScope = tr.scope;
        td.myScope = c;
        td.ref = ref;
        td.getParentList = function(){
            if(this.myScope.parent[this.ref])
                return this.myScope.parent[this.ref]
            return this.myScope.parent;
        };
        td.title = model.get_tooltip(ref);
        try{
          if(td.myScope.error){
              td.title = td.title + '\n\nErro: ' + td.myScope.error;
              td.style.background = '#ffcccc';
              $(td).addClass("erro_mapa");
          }
        }catch(except){}
        // add value e events
        tr.appendChild(td);
        tds.push(td);

        add_values(c, td);
        add_events(td);

        if(next){
            td.rowSpan = get_row_span(ref, c);
            if(c[next] === undefined)
                c[next] = model.complete_line(next);

            if(c[next]){
                if(c[next][0]==undefined){
                  return;
                }
                render_line(next, c[next][0], tr);
                c[next][0]['parent'] = c;

                if(c[next].length > 1){
                    for(var j = 1; j < c[next].length; j++){
                        c[next][j]['parent'] = c;
                        render_line(next, c[next][j], false, true);
                    }
                }
            }
        }
    };

    var taskRenderLine = function(ref, c, i, l){
        l = l || c[ref].length;
        i = i || 0;

        if(l > i){
            c[ref][i]['parent'] = c[ref];
            render_line(ref, c[ref][i]);
            setTimeout(function(){
                taskRenderLine(ref, c, i + 1, l);
            }, 10);
        }
    };

    var render = scope.render = function(){
        tbodyFragment = document.createDocumentFragment();
        el.children[1].innerHTML = '';
        tds = [];
        var c = data['content'];

        var m = model.get_model();
        var ref = model.get_first_ref();

        for(var i in c[ref]){
            c[ref][i]['parent'] = c[ref];
            render_line(ref, c[ref][i], 0);
        }

        el.children[1].appendChild(tbodyFragment);
        scope.renderCallback();

        $.each($("[title='Cargo'] textarea"), function(dx, value){
           $(value).attr("oldValue",$(value).val());
           $(value).attr("resetado",false);
        });
        $.each($("[title='Função'] textarea"), function(dx, value){
           $(value).attr("oldValue",$(value).val());
           $(value).attr("resetado",false);
        });

    };

    var save = scope.save = function(no_re_render, callback, error_callback, extra_url){
        clearInterval(save_interval);
        if(data['content'][model.get_first_ref()] != undefined){
            extra_url = extra_url || '';
            var pruned = JSON.prune(
                data,
                99999999999999999999999999999999999999999,
                99999999999999999999999999999999999999999
            );
            var xhr = $.post(save_url + extra_url, { mapa: pruned}, function(ret){
                $.extend(true, data['content'], ret['content']);
                delete data['deleted'];
                try{
                if(ret['content'].has_error)
                    $.dialogs.success(
                        '<h4>O MAP Salvo com sucesso!</h4>' +
                        '<br> <br>' +
                        '<div style="margin-left: -19px; margin-right: 20px;" class="alert alert-warning">Os campos em vermelho foram ignorados durante o salvamento do mapa.</div>'
                    );
                }catch(Exception){}

                if(no_re_render !== true){
                    scope.render();
                }

                if(callback !== undefined){
                    callback(ret['content']);
                }
                try{
                    after_save(ret['content']);
                }catch(Exception){}

            });
            if(error_callback)
                xhr.error(error_callback);
        }
        else
            if(callback !== undefined)
                callback();

    };

    var add_empty_line = scope.add_empty_line = function(){
        var fref = model.get_first_ref();
        if(data.content[fref]){
            var first = data.content[fref];
            var obj = model.get_empty_line()[fref][0];
            var i=0;

            for(i=0; i < first.length; i++)
                if(first[i]['readonly'])
                    break;

            first.splice(i, 0, obj);
        }else
            data.content = model.get_empty_line();

        scope.render();
    };

    scope.render_all = function(fn){

        scope.renderCallback = fn || scope.renderCallback;

        el.children[0].innerHTML = '';
        el.children[1].innerHTML = '';

        if(scope.model.has_groups()){
            add_groups();
        }

        render();
        menu_events(menu);
        add_header();
    };


    document.addEventListener('click', function(e){
        menu.style.display = 'none';
    });

    // Save map
    setInterval(function(){
        _check_for_save = true;
    }, 15000);

};
