from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Company, Contact, ActivityLog
import threading

# We use a thread local to get the current user since signals don't have access to 'request'
_thread_locals = threading.local()

def set_current_user(user):
    _thread_locals.user = user

def get_current_user():
    return getattr(_thread_locals, 'user', None)

@receiver(post_save, sender=Company)
@receiver(post_save, sender=Contact)
def log_create_or_update(sender, instance, created, **kwargs):
    user = get_current_user()
    if user:
        action = "CREATE" if created else "UPDATE"
        ActivityLog.objects.create(
            organization=instance.organization,
            user=user,
            action=action,
            model_name=sender.__name__,
            object_id=instance.id,
            target=str(instance)
        )

@receiver(post_delete, sender=Company)
@receiver(post_delete, sender=Contact)
def log_delete(sender, instance, **kwargs):
    user = get_current_user()
    if user:
        ActivityLog.objects.create(
            organization=instance.organization,
            user=user,
            action="DELETE",
            model_name=sender.__name__,
            object_id=instance.id,
            target=str(instance)
        )