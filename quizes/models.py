from django.db import models
from random import shuffle


class Quiz(models.Model):
    name = models.CharField(max_length=200)
    theme = models.CharField(max_length=200)
    questions_amount = models.IntegerField()
    time = models.IntegerField(help_text='Отведенное время в минутах')
    score_to_pass  = models.IntegerField(help_text='Счет в процентах')

    def __str__(self) -> str:
        return f'{self.name} - {self.theme}'
    
    def get_questions(self):
        questions = list(self.question_set.all())
        shuffle(questions)
        return questions[:self.questions_amount]
    
    class Meta:
        verbose_name_plural = 'Quizes'