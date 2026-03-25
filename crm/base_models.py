from django.db import models

class OrganizationEntity(models.Model):
    # Every piece of data is "owned" by an organization
    organization = models.ForeignKey('accounts.Organization', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False) # For "Soft Delete" requirement

    class Meta:
        abstract = True