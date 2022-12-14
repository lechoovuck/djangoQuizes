from django.shortcuts import render
from .models import Quiz
from django.views.generic import ListView
from django.http import JsonResponse
from questions.models import *
from results.models import *


class QuizListView(ListView):
    model = Quiz
    template_name = "quizes/main.html"


def quiz_view(request, pk):
    quiz = Quiz.objects.get(pk=pk)
    return render(request,'quizes/quiz.html', {'obj': quiz})

def quiz_data_view(request, pk):
    quiz = Quiz.objects.get(pk=pk)
    questions =[]
    for q in quiz.get_questions():
        answers = []
        for a in q.get_answers():
            answers.append(a.text)
        questions.append({str(q): answers})
    return JsonResponse({
        'Вопросы': questions,
        'Время': quiz.time,
    })
    
def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
    
    
def save_quiz_view(request, pk):
    if is_ajax(request):
        questions = []
        data = request.POST
        dict_data = dict(data.lists())
        dict_data.pop('csrfmiddlewaretoken')
        for key in dict_data.keys():
            question = Question.objects.get(text = key)
            questions.append(question)
            
        print(questions)
        quiz = Quiz.objects.get(pk = pk)
        
        score = 0
        percent = 100 / quiz.questions_amount
        results = []
        correct_answer = None
        
        for question in questions:
            chosen_answer = request.POST.get(str(question))
            print('chosen:', chosen_answer)
            
            if chosen_answer != '':
                variants = Answer.objects.filter(question = question)
                for variant in variants:
                    if variant.correct:
                        correct_answer = variant.text
                        if chosen_answer == variant.text:
                            score += 1
                results.append({str(question): {'верный ответ': correct_answer, 'выбранный ответ': chosen_answer}})
            else:
                results.append({str(question): 'пропущен'})
                
        score *= percent
        score = int(score)
        
        Result.objects.create(quiz = quiz, user = request.user, score=score)
        
        if score >= quiz.score_to_pass:
            return JsonResponse({'пройден': True, 'процент': score, 'результат': results})
        else:
            return JsonResponse({'пройден': False, 'процент': score, 'результат': results})