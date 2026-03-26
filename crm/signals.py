from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Company, Contact, ActivityLog
import threading

_thread_locals = threading.local()

def set_current_user(user):
    """Store the current user in thread-local storage"""
    _thread_locals.user = user

def get_current_user():
    """Retrieve the current user from thread-local storage"""
    return getattr(_thread_locals, 'user', None)

@receiver(post_save, sender=Company)
@receiver(post_save, sender=Contact)
def log_create_or_update(sender, instance, created, **kwargs):
    """
    Automatically log CREATE and UPDATE actions for Companies and Contacts.
    """
    user = get_current_user()
    
    if not user and hasattr(instance, 'organization'):
        user = instance.organization.users.first()
    
    if user:
        action = "CREATE" if created else "UPDATE"
        try:
            ActivityLog.objects.create(
                organization=instance.organization,
                user=user,
                action=action,
                model_name=sender.__name__,
                object_id=instance.id,
                target=str(instance)
            )
        except Exception as e:
            # Prevent signal errors from breaking the main operation
            print(f"Failed to create activity log: {e}")

@receiver(post_delete, sender=Company)
@receiver(post_delete, sender=Contact)
def log_delete(sender, instance, **kwargs):
    """
    Automatically log DELETE actions for Companies and Contacts.
    Note: Since this is a soft-delete implementation in the ViewSet, 
    this signal only fires if the record is hard-deleted from DB.
    If you are using soft-delete (is_deleted=True), you should trigger 
    the log in the ViewSet's perform_destroy method instead.
    """
    user = get_current_user()
    
    # Fallback
    if not user and hasattr(instance, 'organization'):
        user = instance.organization.users.first()
    
    if user:
        try:
            ActivityLog.objects.create(
                organization=instance.organization,
                user=user,
                action="DELETE",
                model_name=sender.__name__,
                object_id=instance.id,
                target=str(instance)
            )
        except Exception as e:
            print(f"Failed to create activity log: {e}")