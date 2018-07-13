from django.contrib import admin

# Register your models here.
from django.contrib import admin

from pesquisa.models import Question, Entrevista

admin.site.register(Question)
admin.site.register(Entrevista)
