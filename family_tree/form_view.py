from django.shortcuts import render


def index(request):
    return render(request, 'family_tree/index.pug')


def tree(request):
    return render(request, 'family_tree/tree.pug')