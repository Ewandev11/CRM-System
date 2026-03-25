from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # We add the user data to the response for React
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(username=request.data.get('username'))
            
            response.data['user'] = {
                'username': user.username,
                'role': user.role,
                'organization': user.organization.name if user.organization else None
            }
        return response