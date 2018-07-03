# -*- coding: utf-* -*-
from chatterbot.trainers import ListTrainer
from chatterbot import ChatBot
from unicodedata import normalize
import os
import logging

bot = ChatBot(
    'TARS',
    read_only=True, # Quando read_only estiver FALSE, ele vai estar no modo treino
    trainer='chatterbot.trainers.ChatterBotCorpusTrainer',
    preprocessors=[
        'chatterbot.preprocessors.clean_whitespace', # Para remover espaço excessivos
        'chatterbot.preprocessors.unescape_html',# Converte carateres para html
        'chatterbot.preprocessors.convert_to_ascii', # Converte unicode para ascii
    ],
    logic_adapters=[
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
# bot.train('/home/rodrigo/sistemas/rodrigo/chat')
bot.train('textos')
# bot.train('chatterbot.corpus.leme')
print('Bot:',bot.get_response('CHATBOT, GO'))
logging.basicConfig(level=logging.INFO)
while True:
    try:
        quest = input('Você: ')
        response = bot.get_response(quest)
        print ('response', response)
        print('Bot: ', str(response))
    except(KeyboardInterrupt, EOFError, SystemExit):
        print("\nTCHAU")
        break
