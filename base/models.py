from django.db import models


# Create your models here.

class Book(models.Model):
    image = models.ImageField(upload_to='images/')
    title = models.CharField(max_length=30)
    summary = models.CharField(max_length=100)
