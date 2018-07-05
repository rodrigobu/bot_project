angular.module('diretivas', [])
    .directive('questao', function() {
        var ddo = {};
        ddo.restrict = 'AE';
        ddo.controllerAs = 'dir';
        ddo.scope = {
            quest: '=quest'
        };
        ddo.templateUrl = "/api/directives/coleta/autodeclaracao/questao";
        ddo.transclude = true;
        return ddo;
    })
    .directive('questaomultipla', function() {
            var ddo = {};
            ddo.restrict = 'AE';
            ddo.controllerAs = 'dir';
            ddo.scope = {
                quest: '=quest'
            };
            ddo.templateUrl = "/api/directives/coleta/autodeclaracao/questaomultipla";
            ddo.transclude = true;
            return ddo;
      });
