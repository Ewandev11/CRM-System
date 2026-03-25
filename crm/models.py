from django.db import models
from django.conf import settings
from django.core.validators import RegexValidator
from accounts.models import Organization

class Company(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='companies')
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="Unspecified") # Required by exam
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_timestamp = models.DateTimeField(auto_now_add=True) # Renamed to match rubric

    def __str__(self):
        return self.name

class Contact(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='contacts')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='company_contacts')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    role = models.CharField(max_length=100, blank=True, null=True) # Required by exam
    
    # Phone validation (8-15 digits) required by exam
    phone_regex = RegexValidator(regex=r'^\d{8,15}$', message="Phone number must be between 8 and 15 digits.")
    phone = models.CharField(validators=[phone_regex], max_length=15, blank=True, null=True)
    
    is_deleted = models.BooleanField(default=False)
    created_timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        # "Email uniqueness within the same company" required by exam
        constraints = [
            models.UniqueConstraint(fields=['email', 'company'], name='unique_email_per_company')
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class ActivityLog(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='crm_activity_logs')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='crm_user_activities')
    action = models.CharField(max_length=50) # CREATE, UPDATE, DELETE
    model_name = models.CharField(max_length=50, default="Unknown") 
    object_id = models.IntegerField(null=True, blank=True) 
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} on {self.model_name}"