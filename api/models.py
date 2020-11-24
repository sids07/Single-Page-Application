from django.db import models

# Create your models here.

from django.contrib.auth.hashers import make_password
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, UserManager


# Create your models here.
class User(AbstractBaseUser):
    '''
    AbstractBaseUser is the base function for user given by django based on which we made our User by default it has two field password and last login.
    We can check about this class on django github in https://github.com/django/django/blob/master/django/contrib/auth/base_user.py
    Further we can also use AbstractUser from django https://github.com/django/django/blob/master/django/contrib/auth/models.py.
    But preferred method is inheriting AbstractBaseUser and making our own User class.
    Main thing to consider is UserManager() object, UserManager can be used as default from django and also made manually.
    Main work for UserManager is to give user the ability to create superuser , other user etc. We can look UserManager method on github and can see method for those feature.
    '''
    email=models.EmailField(max_length=128)
    username=models.CharField(max_length=128,unique=True)
    confirm_password=models.CharField(max_length=128)

    groups = None
    user_permissions = None
    objects = UserManager()
    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


def set_password(raw_password):
    password = make_password(raw_password)
    return password

class Write(models.Model):
    image = models.ImageField(upload_to='images',blank=True,default='static/blood.jpg')
    title = models.CharField(max_length=30)
    summary = models.CharField(max_length=100)