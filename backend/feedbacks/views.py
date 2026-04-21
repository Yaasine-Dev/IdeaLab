from django.http import HttpResponse


def index(request):
    return HttpResponse("Page d'accueil Feedbacks")

