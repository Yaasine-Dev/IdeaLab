from django.contrib import admin
from .models import Vote


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'target_type', 'target_id', 'value', 'created_at']
    list_filter = ['target_type', 'value', 'created_at']
    search_fields = ['user__username', 'target_id']
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['user']
