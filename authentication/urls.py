from django.urls import path
from authentication.views import *
from quizes.views import *

urlpatterns = [
    path('home', QuizListView.as_view(), name = 'quiz-list'),
    path('', homePage, name = "home-page"),
    path('register/', register, name = "register-page"),
    path('login/', auth_login, name = "login-page"),
    path('logout/', auth_logout, name = "logout")
]
