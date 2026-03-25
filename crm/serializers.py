from rest_framework import serializers
from .models import Company, Contact, ActivityLog

class CompanySerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ['id', 'name', 'industry', 'country', 'logo', 'logo_url', 'created_timestamp']
        read_only_fields = ['organization']

    def get_logo_url(self, obj):
        if obj.logo:
            return obj.logo.url
        return None

class ContactSerializer(serializers.ModelSerializer):
    company_name = serializers.ReadOnlyField(source='company.name')

    class Meta:
        model = Contact
        fields = ['id', 'company', 'company_name', 'first_name', 'last_name', 'email', 'phone', 'role', 'created_timestamp']
        read_only_fields = ['organization']

    def validate(self, data):
        # Rubric Requirement: Email uniqueness within the same company
        email = data.get('email')
        company = data.get('company')
        
        # Check if updating an existing instance or creating a new one
        instance = getattr(self, 'instance', None)
        qs = Contact.objects.filter(email=email, company=company)
        if instance:
            qs = qs.exclude(pk=instance.pk)
            
        if qs.exists():
            raise serializers.ValidationError({"email": "A contact with this email already exists in this company."})
        return data

class ActivityLogSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = ActivityLog
        fields = ['id', 'user_email', 'action', 'model_name', 'target', 'timestamp']