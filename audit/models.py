from django.db import models
from django.conf import settings

class ActivityLog(models.Model):
    ACTION_CHOICES = [('CREATE', 'Create'), ('UPDATE', 'Update'), ('DELETE', 'Delete')]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action_type = models.CharField(max_length=10, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=50)
    object_id = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    organization = models.ForeignKey('accounts.Organization', on_delete=models.CASCADE)

    def __clstr__(self):
        return f"{self.user} - {self.action_type} - {self.model_name}"