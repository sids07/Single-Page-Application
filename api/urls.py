from django.urls import path

from .views import register, userlogin, userlogout, CustomAuthToken, WriteClassBasedViews
urlpatterns=[
path('signup/',register),
path('signin/',CustomAuthToken.as_view()),
path('login/',userlogin),
path('logout/',userlogout),
path('write/',WriteClassBasedViews.as_view()),
path('write/<int:user_id>',WriteClassBasedViews.as_view()),
]