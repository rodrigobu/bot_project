import datetime

from django.db import models
from django.utils import timezone

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('data publicada')

    class Meta:
        db_table = 'question'

    def __str__(self):
        return self.question_text

    def publicacao_recente(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    class Meta:
        db_table = 'choice'

    def __str__(self):
        return self.choice_text

class Entrevista(models.Model):
    entrevista = models.BooleanField(default=False)

    class Meta:
        db_table = 'entrevista'

    def __str__(self):
        return 'Entrevista is {}'.format(self.entrevista)
