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
        fields = ['id', 'organization', 'company', 'company_name', 'first_name', 'last_name', 'email', 'phone', 'role', 'created_timestamp']
        read_only_fields = ['organization']

    def create(self, validated_data):
        # Automatically assign organization from the logged-in user
        request = self.context.get('request')
        if not request or not hasattr(request.user, 'organization'):
            raise serializers.ValidationError("User organization not found.")
            
        validated_data['organization'] = request.user.organization
        return super().create(validated_data)

    def validate(self, data):
        request = self.context.get('request')
        if not request or not hasattr(request.user, 'organization'):
            raise serializers.ValidationError("User organization not found.")
            
        user = request.user
        email = data.get('email')
        company = data.get('company')
        
        if not company:
            raise serializers.ValidationError({"company": "A company must be selected."})

        # Check if the company belongs to the user's organization
        if company.organization != user.organization:
            raise serializers.ValidationError({"company": "You can only add contacts to companies in your organization."})
        
        instance = getattr(self, 'instance', None)
        qs = Contact.objects.filter(email=email, company=company, organization=user.organization)
        
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