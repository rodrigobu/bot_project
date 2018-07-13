angular.module('servicosColeta', ['ngRoute', 'diretivas', 'ngResource', 'ngSanitize'])
    .factory('recursoColeta', function($resource) {
        return $resource('/coleta/autodeclaracao/api/', null, {
            update: {
                method: 'PUT'
            },
            encerrar: {
                method: 'PATCH'
            }
        });
    })
    .factory('selColeta', function($q, $location, $routeParams, $rootScope, recursoColeta) {
        var service = {};
        service.selecionar = function($scope) {
            return $q(function(resolve, reject) {
                recursoColeta.get({}, {},
                    function(dados) {
                        $scope.coleta = dados;
                        try{
                            $scope.questao = undefined;
                            $scope.questoes = dados["questoes"]
                            $scope.coleta.total_questoes = dados["questoes"].length;
                        } catch(e) {
                            $scope.questao = undefined;
                            $scope.questoes = []
                            $scope.coleta.total_questoes = 0;
                        }
                        if (!$scope.coleta.coleta_disponivel){
                            $scope.coleta.mensagem = $scope.coleta.mensagens.indisponivel;
                        } else if ($scope.coleta.finalizada) {
                            $scope.coleta.mensagem = $scope.coleta.mensagens.finalizada;
                        } else {
                            if($scope.coleta.total_questoes==0){
                                $scope.coleta.mensagem = $scope.coleta.mensagens.sem_questao;
                            } else {
                                $scope.coleta.mensagem = $scope.coleta.mensagens.inicio;
                            }
                        }
                        resolve(dados);
                    }
                )
            });
        }
        service.salvar = function(questao) {
            return $q(function(resolve, reject) {
                $("tr").removeClass("danger");
                if(questao["questoes"]){
                    //
                    valido = true;
                    $.each( questao["questoes"] , function(idx, value){
                        console.log(value)
                        if(value.resposta==''){
                          $("#tr_"+value.id).addClass("danger");
                          valido = false;
                        }
                    });
                    if(!valido){
                      reject({
                          erro: { "mensagem" : "Para alternar entre as páginas é necessário responder a(s) questão(ões)." }
                      });
                    }
                } else {
                    if(questao.resposta=='' && questao.resposta!=0){
                      $("#tr_"+questao.id).addClass("danger");
                      reject({
                          erro: { "mensagem" : "Para alternar entre as páginas é necessário responder a(s) questão(ões)." }
                      });
                      return;
                    }
                }
                console.log(questao.resposta)

                recursoColeta.update({}, questao,
                    function(dados) {
                        resolve(dados);
                    },
                    function(erro) {
                        reject({
                            erro: erro.data
                        });
                    }
                )
            });
        }
        service.montar_questao = function($scope, $routeParams) {
            if ($routeParams.index && !isNaN($routeParams.index)) {

                // Definição de variaveis de controle
                indice = parseInt($routeParams.index);

                // Definição das questões
                QUESTOES = $scope.coleta["questoes"];
                $scope.questao = QUESTOES[indice];
                console.log("$scope.questao")
                console.log($scope.questao)
                $scope.questao.indice = indice + 1;

                /// Definição dos índices de próxima e anterior
                if (!$scope.questao.anterior) {
                    if (indice >= 1) {
                        $scope.questao.anterior = indice - 1;
                    }
                }
                if (!$scope.questao.proxima) {
                    $scope.questao.proxima = undefined;
                    if (indice < $scope.coleta.total_questoes) {
                        if (QUESTOES[indice + 1]) {
                            $scope.questao.proxima = indice + 1;
                        }
                    }
                }
                $scope.questao.finalizar = !$scope.questao.proxima;

                $rootScope.$broadcast("questaoMontada", {
                    questao: $scope.questao,
                    coleta: $scope.coleta
                });
            } else {
                $location.path("/");
            }
        }
        service.finalizar = function($scope) {
            recursoColeta.encerrar({}, $scope.questao,
                function(dados) {
                    $scope.coleta.mensagem = $scope.coleta.mensagens.encerrada;
                    $scope.coleta.encerrada = true;
                    $rootScope.$broadcast("questaoMontada", {
                        questao: undefined,
                        coleta: $scope.coleta
                    });
                    resolve(dados);
                },
                function(erro) {
                    reject({
                        erro: erro.data
                    });
                }
            );
        }
        return service;
    })
