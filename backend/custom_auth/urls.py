from django.urls import path
from .views import LoginView, RegisterView, UserUpdateView, UserDeleteView, UserListView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='user-list'),  # Add UserListView route
    path('users/<int:user_id>/', UserUpdateView.as_view(), name='user-update'),  # Update user
    path('users/<int:user_id>/delete/', UserDeleteView.as_view(), name='user-delete'),  # Delete user
]
