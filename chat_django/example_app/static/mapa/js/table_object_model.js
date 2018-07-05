var TableObjectModel = function(data){
    'use strict';
    var scope = this;
    // -------------------------------------------------------------------
    // Caches
    // -------------------------------------------------------------------
    var model = null;               // The data model
    var has_groups = null;          // (Cache) Check if table has subtitle
    var nexts = {};                 // (Cache) get next cache
    var prevs = {};                 // (Cache) get prev cache
    var fields = {};                // (Cache) get field cache
    var classes = {};               // (Cache) get field classes
    var titles = {};                // (Cache) get title cache
    var tooltips = {};              // (Cache) get tooltip cache
    var tree = {};                  // (Cache) has tree
    var change_parent = {};         // (Cache) can change parent

    // Check if table has subtitle
    var has_groups = scope.has_groups = function(){
        return false;
        if(scope._has_groups == null){
            var h = data['headers'];
            for(var i in h){
                if(h[i]['type'] === 'group'){
                    return scope._has_sutitle = true;
                }
            }
        }
        return scope._has_groups;
    };

    // Get the model
    var get_model = scope.get_model = function(){
        if(model !== null)
            return model;

        var h = data['headers'];
        model = [];
        for(var i in h)
            if(h[i]['type'] === 'col')
                model.push(h[i]);
            else
                for(var j in h[i]['values']) {
                    model.push(h[i]['values'][j]);
                }
        return model;
    };

    var set_model = scope.set_model = function(model_data){
        model = model_data;    
    }

    var get_data = scope.get_data = function(){
        return data;    
    }
    var set_data = scope.set_data = function(new_data){
        data = new_data;    
    }

    // Return the first ref of object
    var get_first_ref = scope.get_first_ref = function(){
        return get_model()[0].ref;
    };

    // Return a empty line
    var get_empty_line = scope.get_empty_line = function(){
        var models = get_model();
        var new_data = {};
        var edit = new_data;

        for(var key in models){
            var model = models[key];
            var fields = {};

            for(var i in model.field_names){
                fields[model.field_names[i]] = null;
            }

            edit[model.ref] = [{value: fields}];
            edit = edit[model.ref][0];
        }
        return new_data;
    };

    // Return the next Ref
    var get_next = scope.get_next = function(ref){
        if(nexts[ref] !== undefined)
            return nexts[ref];

        var m = get_model();
        for(var i in m)
            if(m[i]['ref'] === ref)
                try{
                    nexts[ref] = m[parseInt(i)+1]['ref'];
                } catch(e){
                    nexts[ref] = false;
                }

        return nexts[ref];
    };

    // Return the prev Ref
    var get_prev = scope.get_prev = function(ref){
        if(prevs[ref] !== undefined)
            return prevs[ref];

        if (ref === get_first_ref()){
            prevs[ref] = '';
            return prevs[ref];
        }

        var prev = get_first_ref();

        do{
            var prev2 = get_next(prev);
            if(prev2 === ref){
                prevs[ref] = prev;
                return prevs[ref];
            }
        }while(prev = get_next(prev))

    };

    // Complete a line from a ref
    var complete_line = scope.complete_line = function(from){
        var tmp_next = get_first_ref();
        var tmp_obj = get_empty_line()[tmp_next];

        while(tmp_next != from){
            tmp_next = get_next(tmp_next);
            tmp_obj = tmp_obj[0][tmp_next];
        }

        return tmp_obj;
    };

    // Return the html field
    var get_field = scope.get_field = function(ref){
        if(fields[ref] !== undefined)
            return fields[ref];

        var m = get_model();
        for(var i in m)
            if(m[i]['ref'] === ref){
                fields[ref] = m[i]['field'];
            }

        return fields[ref];
    };

    // get the title of object
    var get_title = scope.get_title = function(ref){
        if(titles[ref] !== undefined)
            return titles[ref];

        var m = get_model();
        for(var i in m)
            if(m[i]['ref'] === ref){
                titles[ref] = m[i]['title'];
            }

        return titles[ref];
    };

    // get the title of object
    var get_tooltip = scope.get_tooltip = function(ref){
        if(tooltips[ref] !== undefined)
            return tooltips[ref];

        var m = get_model();
        for(var i in m)
            if(m[i]['ref'] === ref)
                tooltips[ref] = m[i]['tooltip'];
        
        if(tooltips[ref] == undefined)
            tooltips[ref] = get_title(ref).replace(/<(?:.|\n)*?>/gm, ' ');

        return tooltips[ref];
    };

    // Check if is possible do tree in ref
    var has_tree = scope.has_tree = function(ref){
        if(tree[ref] !== undefined)
            return tree[ref];

        var m = get_model();
        for(var i in m)
            if(m[i]['ref'] === ref){
                tree[ref] = m[i]['tree'] || false;
            }

        return tree[ref];
    };

    // Check if is possible change the parent
    var can_change_parent = scope.can_change_parent = function(ref){
        if(change_parent[ref] !== undefined)
            return change_parent[ref];

        var m = get_model();
        for(var i in m)
            if(m[i]['ref'] === ref){
                change_parent[ref] = m[i]['change_parent'] || false;
            }

        return change_parent[ref];
    }

    // Remove a object
    var remove_line = scope.remove_line = function(ref, c){
        var parent = c.parent[ref] || data['content'][get_first_ref()];
        data['deleted'] = data['deleted'] || [];

        for(var i in parent){
            if(c === parent[i]){
                c.ref = ref;
                data['deleted'].push(c);

                parent.splice(i, 1);
                return true;
            }
        }

        return false;
    };

    var count_refs = scope.count_refs = function(ref, find, c){
        if(c[find])
            return c[find].length;

        var next = get_next(ref);

        if(!has_tree(ref))
            return 1;

        if(next){
            var total = 0;
            for(var i in c[next]){
                total += count_refs(next, find, c[next][i]);
            }

            if(total === 0) return 1;
            return total;
        }

        return 1; // This is it, or this is inner of it

    };

    var change_parent_options = scope.change_parent_options = function(ref, c){
        var parents = c.parent.parent;
        var ret = [];
        for (var i in parents) {
            if(parents[i] != c.parent)
                ret.push({
                    'label': parents[i].value[get_prev(ref)],
                    'obj': parents[i]
                })
        }

        return ret;
    }

    var change_parent = scope.change_parent = function(ref, c, to){
        var original_parent = c.parent[ref];


        for(var i in original_parent){
            if(c === original_parent[i]){
                c.ref = ref;
                original_parent.splice(i, 1);

                if(original_parent.length === 0){
                    original_parent.push(complete_line(ref)[0]);
                }
            }
        }

        c.parent = to;
        to[ref].push(c);
    }

}
