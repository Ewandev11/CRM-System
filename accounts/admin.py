from django.contrib import admin
from .models import User, Organization

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'subscription_plan', 'created_at')

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'role', 'organization', 'is_staff')
    list_filter = ('role', 'organization')