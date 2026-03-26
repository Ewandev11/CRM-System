from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # First, get the standard JWT response (access/refresh tokens)
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            User = get_user_model()
            try:
                user = User.objects.get(username=request.data.get('username'))
                
                # Add user details to the response
                response.data['user'] = {
                    'username': user.username,
                    'role': user.role,
                    'organization': user.organization.name if user.organization else None,
                    'organization_id': user.organization.id if user.organization else None
                }
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        return response