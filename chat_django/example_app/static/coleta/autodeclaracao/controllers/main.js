angular.module('coletaApp', ['ngRoute', 'diretivas', 'servicosColeta', 'ngResource'])
    .config(function($interpolateProvider, $routeProvider, $locationProvider) {
        /* Configuração de tags para não gerar conflito com o django */
        $interpolateProvider.startSymbol('{$');
        $interpolateProvider.endSymbol('$}');
        /* Configuração de rotas da api */
        $locationProvider.html5Mode(true);
        $routeProvider.when('/', {
            controller: 'coletaController',
            templateUrl: "/api/partials/coleta/autodeclaracao/info"
        });
        $routeProvider.when('/questao/:index', {
            controller: 'questoesController',
            templateUrl: "/api/partials/coleta/autodeclaracao/questao"
        });
        $routeProvider.when('/finalizar/', {
            controller: 'encerramentoController',
            templateUrl: "/api/partials/coleta/autodeclaracao/info"
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    })
    .controller('coletaController', function($scope, $rootScope, selColeta) {
        /* Controle de Inicio da Coleta, tudo sempre irá pegar ele */
        selColeta.selecionar($scope)
            .then(function(dados) {
                $rootScope.$broadcast("questaoMontada", {
                    questao: undefined,
                    coleta: $scope.coleta
                });
            });
    })
    .controller('questoesController', function($scope, $routeParams, $location, selColeta) {
        /* Motor principal das questões da coleta, capta o indice e seleciona a
        questão que deve aparecer */
        if (!$scope.coleta) {
            $location.path("/");
            /*selColeta.selecionar($scope)
                .then(function(dados) {
                    selColeta.montar_questao($scope, $routeParams)
                });*/
        } else {
            selColeta.montar_questao($scope, $routeParams)
        }
        // Define o submit do formulario para salvar as questões
        $scope.submeter = function(tipo) {
            selColeta.salvar($scope.questao)
                .then(function(dados) {
                    // Após salvar, devia para a proxima questão ou a anterior
                    // tipo sempre vem com 'proxima' ou 'anterior'
                    if($scope.questao.finalizar && tipo!='anterior'){
                      $location.path("/finalizar/");
                    } else {
                      $location.path("/questao/" + $scope.questao[tipo]);
                    }
                })
                .catch(function(erro) {
                    $.dialogs.error(erro.erro.mensagem)
                });
        }
    })
    .controller("contadorController", function($scope) {
        /* Controler da exibição da páginas das questões, um broadcast emite um
        evento e ele atualiza o cabeçalho, que não faz parte do controller principal */
        $scope.$on("questaoMontada", function(event, options) {
            $scope.questao = options.questao;
            $scope.coleta = options.coleta;
        });
    })
    .controller('encerramentoController', function($scope, $routeParams, $location, selColeta) {
        /* Exibe a tela final após responder a última questao */
        if (!$scope.coleta) {
            $location.path("/");
        } else {
            selColeta.finalizar($scope);
        }
    });
