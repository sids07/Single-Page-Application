# Generated by Django 3.1.2 on 2020-11-23 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_write'),
    ]

    operations = [
        migrations.AddField(
            model_name='write',
            name='image',
            field=models.ImageField(default='static/blood.jpg', upload_to='images'),
        ),
    ]
