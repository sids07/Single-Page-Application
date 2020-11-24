from rest_framework import serializers
from django.contrib.auth import authenticate

from rest_framework.fields import ListField
from .models import Write

class Signup(serializers.Serializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    username = serializers.CharField(max_length=128)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, write_only=True, required=True)
    confirm_password = serializers.CharField(max_length=128, write_only=True, required=True)

    def validate(self, data):
        password = data["password"]
        confirm_password = data["confirm_password"]

        if password != confirm_password:
            raise serializers.ValidationError('Password donot match')
        return data


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=128)
    password = serializers.CharField()

    def validate(self, data):

        username = data["username"]
        password = data["password"]

        if username and password:

            user = authenticate(username=username, password=password)

            if user:
                data['user'] = user
            else:
                raise serializers.ValidationError("Unable to login with given credentials")
        else:
            raise exceptions.ValidationError("Must provide username and password")
        return data

class WriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Write
        fields = ['id','image','title','summary']