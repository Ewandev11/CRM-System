from django.contrib import admin
from .models import Company, Contact, ActivityLog
# We still import it if we need it for logic, but we don't register it here anymore

admin.site.register(ActivityLog)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'industry', 'organization')
    list_filter = ('organization', 'industry')
    search_fields = ('name',)

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'company', 'organization')
    list_filter = ('organization', 'company')
    search_fields = ('first_name', 'last_name', 'email')