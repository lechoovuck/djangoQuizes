from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required


@login_required
def homePage(request):
    return redirect('quiz-list')

def register(request):
    if request.method == 'POST':
        first_name = request.POST.get('fname')
        last_name = request.POST.get('lname')
        user_name = request.POST.get('uname')
        email = request.POST.get('email')
        password = request.POST.get('passw')
        
        new_user = User.objects.create_user(username=user_name, email=email, password=password)
        new_user.first_name = first_name
        new_user.last_name = last_name
        new_user.save()
        return redirect('login-page')

    return render(request, 'authentication/register.html', {})

def auth_login(request):
    if request.method == 'POST':
        user_name = request.POST.get('uname')
        password = request.POST.get('passw')
        
        new_user = authenticate(request, username=user_name, password=password)
        
        if new_user is not None:
            login(request, new_user)
            return redirect('home-page')
        else:
            return HttpResponse('Non-existent user.')

    return render(request, 'authentication/login.html', {})

def auth_logout(request):
    logout(request)
    return redirect('login-page')
