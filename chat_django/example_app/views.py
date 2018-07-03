import json
import logging
import requests

from django.views.generic.base import TemplateView
from django.views.generic import View
from django.http import JsonResponse

from chatterbot import ChatBot
from chatterbot.utils import input_function
from chatterbot.logic import LogicAdapter
from chatterbot.ext.django_chatterbot import settings



class ChatterBotAppView(TemplateView):
    template_name = 'app.html'


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['valor'] = 'CHATBOT'
        return context



class MyLogicAdapter(LogicAdapter):
    def __init__(self, **kwargs):
        super(MyLogicAdapter, self).__init__(**kwargs)

    def can_process(self, statement):
        """
        Return true if the input statement contains
        'what' and 'is' and 'temperature'.
        """
        words = ['what', 'is', 'temperature']
        if all(x in statement.text.split() for x in words):
            return True
        else:
            return False

    def process(self, statement):
        from chatterbot.conversation import Statement
        import requests

        # Make a request to the temperature API
        # response = requests.get('https://api.temperature.com/current?units=celsius')
        # data = response.json()

        # Let's base the confidence value on if the request was successful
        # if response.status_code == 200:
        confidence = 1
        # else:
        #     confidence = 0

        # temperature = data.get('temperature', 'unavailable')

        response_statement = Statement('The current temperature is {}'.format('oba'))

        return confidence, response_statement

class ChatterBotApiView(View):
    """
    Provide an API endpoint to interact with ChatterBot.
    """
    logging.basicConfig(level=logging.INFO)



    chatterbot = ChatBot(**settings.CHATTERBOT,
        logic_adapters=[
            {
                'import_path': 'chatterbot.logic.BestMatch'
            },
            {
                'import_path': 'chatterbot.logic.LowConfidenceAdapter',
                'threshold': 0.7,
                'default_response': 'Resposta invalida'
            },
            {
                'import_path': 'example_app.views.MyLogicAdapter'
            }
        ],
    )
    # chatterbot = ChatBot(
    #     'T.A.R.S',
    #     read_only=False,
    #     trainer='chatterbot.trainers.ChatterBotCorpusTrainer',
    #     preprocessors=[
    #         'chatterbot.preprocessors.clean_whitespace',
    #         'chatterbot.preprocessors.unescape_html',
    #         'chatterbot.preprocessors.convert_to_ascii',
    #     ],
    #     )
    # chatterbot.train('chatterbot.corpus.leme')
    # bot.tr
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
        print ('resquest', request)
        # existing_conversation = False
        # try:
            # Conversation.objects.get(id=conversation.id)
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
            'BOT': self.chatterbot.name,
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
        response = self.chatterbot.get_response(input_data)
        # if float(response.confidence) > 0.5:
        response_data = response.serialize()
        # else:
        #     input_data = {'text': 'Resposta invalida'}
        #     response = self.chatterbot.get_response(input_data, conversation.id)
        #     # print ('response', response)
        #     response_data = response.serialize()

            # print('Bot: Não entendi.')

        return JsonResponse(response_data, status=200)
