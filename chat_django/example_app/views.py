import json
import logging
import requests

from django.views.generic.base import TemplateView
from django.views.generic import View
from django.http import JsonResponse

from chatterbot import ChatBot
from chatterbot.utils import input_function, get_response_time
from chatterbot.logic import LogicAdapter
from chatterbot.ext.django_chatterbot import settings



class ChatterBotAppView(TemplateView):
    template_name = 'chat.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['valor'] = 'CHATBOT'
        return context

class AdaptadorLogico(LogicAdapter):
    def __init__(self, **kwargs):
        super(AdaptadorLogico, self).__init__(**kwargs)

    def can_process(self, statement):
        """
        Return true if the input statement contains
        'what' and 'is' and 'temperature'.
        """
        words = ['Oba', 'Eita', 'Weslley'] # Pode ser passado palavras  para fazer comparação
        # if all(x in statement.text.split() for x in words):
        if statement.text in words:
            ''' Se o conjunto de palavras retornar true vai ser processado o
                Adaptador com a respostas especificas
            '''
            return True
        else:
            return False

    def process(self, statement):
        from chatterbot.conversation import Statement

        if statement == 'Oba':
            resposta = 'Leydson, é você?'
            confidence = 1

        if statement == 'Eita':
            resposta = 'Lucas. é você?'
            confidence = 1

        if statement == 'Weslley':
            resposta = 'Sabião, é você?'
            confidence = 1

        else:
            confidence = 0

        response_statement = Statement(resposta)

        return confidence, response_statement

class ChatterBotApiView(View):
    """
    Provide an API endpoint to interact with ChatterBot.
    """
    logging.basicConfig(level=logging.INFO)

    bot = ChatBot(
            **settings.CHATTERBOT,
            read_only = True, # Quando read_only estiver FALSE, ele vai estar no modo treino
            preprocessors = [
                'chatterbot.preprocessors.clean_whitespace', # Para remover espaço excessivos
                'chatterbot.preprocessors.unescape_html',# Converte carateres para html
                'chatterbot.preprocessors.convert_to_ascii', # Converte unicode para ascii
            ],

            logic_adapters = [
                # Adaptador logico, para respostas especificas.
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
            ],
        )


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

        # conversation.id = request.session.get('conversation_id', 0)
        # existing_conversation = False
        # try:
        print ('Conversation',Response.objects.all())
        existing_conversation = True

        # except Conversation.DoesNotExist:
        #     conversation_id = self.chatterbot.storage.create_conversation()
        #     request.session['conversation_id'] = conversation_id
        #     conversation.id = conversation_id
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
        valor = 'CHATBOT'
        return JsonResponse({
            'BOT': self.bot.name,
            'conversation': conversation.statements
        })

    def post(self, request, *args, **kwargs):
        """
        Return a response to the statement in the posted data.

        * The JSON data should contain a 'text' attribute.
        """

        input_data = json.loads(request.read())
        if 'text' not in input_data:
            return JsonResponse({
                'text': [
                    'The attribute "text" is required.'
                ]
            }, status=400)

        # print ('input_data', input_data)

        conversation = self.get_conversation(request)
        response = self.bot.get_response(input_data)
        # if float(response.confidence) > 0.5:
        response_data = response.serialize()
        # else:
        #     input_data = {'text': 'Resposta invalida'}
        #     response = self.chatterbot.get_response(input_data, conversation.id)
        #     # print ('response', response)
        #     response_data = response.serialize()

            # print('Bot: Não entendi.')

        return JsonResponse(response_data, status=200)
