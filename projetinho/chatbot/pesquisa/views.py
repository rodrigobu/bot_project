import json
import logging
import requests

from django.views.generic.base import TemplateView
from django.views.generic import View
from django.http import JsonResponse
from pesquisa.models import Entrevista

from chatterbot import ChatBot
from chatterbot.utils import input_function, get_response_time
from chatterbot.logic import LogicAdapter
from chatterbot.ext.django_chatterbot import settings
from chatterbot.ext.django_chatterbot.models import Conversation, Response


class ChatterBotAppView(TemplateView):
    template_name = 'chat.html'
    entrevista = False
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['nome_chatbot'] = 'CHATBOT'
        if self.entrevista:
            context['texto_inicial'] = 'Bom dia sou, CHATBOT. Posso fazer algumas perguntas ?'
        else:
            context['texto_inicial'] = 'Bom dia sou, CHATBOT. Como vai você?'
        context['entrevista'] = self.entrevista

        return context


class BotAppEntrevista(ChatterBotAppView):
    template_name = 'chat_ant.html'
    entrevista = True


class AdaptadorLogico(LogicAdapter):

    def __init__(self, **kwargs):
        super(AdaptadorLogico, self).__init__(**kwargs)


    def process(self, statement):
        from chatterbot.conversation import Statement
        # Let's base the confidence value on if the request was successful
        if statement.text == 'Sim_1':
            response_statement = Statement('Você atualmente trabalha?')
            confidence = 1

        elif statement.text == 'Sim_2':
            response_statement = Statement('Você tem experiência na área?')
            confidence = 1

        elif statement.text == 'Sim_3':
            response_statement = Statement('Oba')
            confidence = 1

        elif statement.text == 'Nao_1':
            response_statement = Statement('Que pena')
            confidence = 1

        elif statement.text == 'Nao_2':
            response_statement = Statement('Que pena')
            confidence = 1
        else:
            response_statement = Statement('Fim da conversa')
            confidence = 0

        return confidence, response_statement


class ChatterBotApiView(View):
    """
    Provide an API endpoint to interact with ChatterBot.
    """
    logging.basicConfig(level=logging.INFO)
    def adaptadores(self):
        logic_adapters = [
            {
                'import_path': 'chatterbot.logic.SpecificResponseAdapter',
                'input_text': 'Help me!',
                'output_text': 'Ok, here is a link: http://chatterbot.rtfd.org'
            },

            # Adaptador logico, para trazer a melhor resposta
            {
                'import_path': "chatterbot.logic.BestMatch",
                "statement_comparison_function": "chatterbot.comparisons.levenshtein_distance",
                "response_selection_method": "chatterbot.response_selection.get_first_response"
            },

            # Setar respostas de baixa confiança, verfica se a resposta tem um confiabilidade aceitavel,
            # Senão retonar uma resposta default.
            {
                'import_path': 'chatterbot.logic.LowConfidenceAdapter',
                'threshold': 0.7,
                'default_response': 'Malz ae man'
            },
        ]
        return logic_adapters

    def chatbot(self):
        bot = ChatBot(
            **settings.CHATTERBOT,
            logic_adapters = self.adaptadores()
        )
        return bot

    def get_conversation(self, request):
        """
        Return the conversation for the session if one exists.
        Create a new conversation if one does not exist.
        """
        class Obj(object):
            def __init__(self):
                self.id = None
                self.statements = []

        conversation = Obj()
        conversation.id = request.session.get('conversation_id', 0)
        existing_conversation = False
        try:
            Conversation.objects.get(id=conversation.id)
            existing_conversation = True

        except Conversation.DoesNotExist:
            conversation_id = self.bot.storage.create_conversation()
            request.session['conversation_id'] = conversation_id
            conversation.id = conversation_id
        if existing_conversation:
            responses = Response.objects.filter(
                conversations__id=conversation.id
            )

            for response in responses:
                conversation.statements.append(response.statement.serialize())
                conversation.statements.append(response.response.serialize())
        return conversation


    def get(self, request, *args, **kwargs):
        """
        Return data corresponding to the current conversation.
        """

        conversation = self.get_conversation(request)

        return JsonResponse({
            'BOT': self.chatbot().name,
            'conversation': conversation.statements
        })

    def post(self, request, *args, **kwargs):
        """
        Return a response to the statement in the posted data.

        * The JSON data should contain a 'text' attribute.
        """

        input_data = json.loads(request.read().decode('utf-8'))
        if 'text' not in input_data:
            return JsonResponse({
                'text': [
                    'The attribute "text" is required.'
                ]
            }, status=400)

        conversation = self.get_conversation(request)
        response = self.chatbot().get_response(input_data, conversation.id)
        response_data = response.serialize()

        return JsonResponse(response_data, status=200)


class BotEntrevista(ChatterBotApiView):
    def adaptadores(self):
        logic_adapters = [{
        # Adaptador logico, para respostas especificas.
            'import_path': 'pesquisa.views.AdaptadorLogico',
        }]
        return logic_adapters


    def get_conversation(self, request):
        """
        Return the conversation for the session if one exists.
        Create a new conversation if one does not exist.
        """
        from chatterbot.ext.django_chatterbot.models import Conversation, Response
        class Obj(object):
            def __init__(self):
                self.id = None
                self.statements = []

        conversation = Obj()

        print ('Conversation',Response.objects.all())
        existing_conversation = True
        if existing_conversation:
            responses = Response.objects.filter(
                conversations__id=conversation.id
            )
            for response in responses:
                conversation.statements.append(response.statement.serialize())
                conversation.statements.append(response.response.serialize())
        return conversation
