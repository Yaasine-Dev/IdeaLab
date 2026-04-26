from rest_framework import serializers
from .models import Bookmark
from ideas.serializers import IdeaSerializer


class BookmarkSerializer(serializers.ModelSerializer):
    idea = IdeaSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = ('id', 'idea', 'saved_at')
        read_only_fields = ('id', 'saved_at')
