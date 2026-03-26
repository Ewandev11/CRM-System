from .signals import set_current_user

class AuditlogMiddleware:
    """
    Middleware to capture the current user for activity logging.
    This ensures that signals (which don't have access to 'request') 
    can still know who performed the action.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if hasattr(request, 'user') and request.user.is_authenticated:
            set_current_user(request.user)
        else:
            set_current_user(None)
            
        response = self.get_response(request)
        return response