from django.db import models
from quizes.models import Quiz

class Question(models.Model):
    text = models.CharField(max_length=200)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return str(self.text)
    
    
    def get_answers(self):
        return self.answer_set.all()
    
class Answer(models.Model):
    text = models.CharField(max_length=200)
    correct = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

        
    def __str__(self) -> str:
        return f'Вопрос: {self.question.text}; ответ: {self.text}; верно: {self.correct}'
    
    
    def get_answers(self):
        pass
    