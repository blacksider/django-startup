from django.core.validators import MinValueValidator
from rest_framework import serializers

from .models import Tree


class TreeSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True, max_length=100)
    age = serializers.IntegerField(required=True, validators=[MinValueValidator(0)])
    create_time = serializers.DateTimeField(read_only=True)
    update_time = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Tree.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.age = validated_data.get('age', instance.age)
        instance.save()
        return instance
