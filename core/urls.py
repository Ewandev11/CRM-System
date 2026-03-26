from django.contrib import admin
from django.urls import path, include
from accounts.views import LoginView 

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/v1/auth/login/', LoginView.as_view(), name='login'),
    
    path('api/v1/', include('crm.urls')), 
]