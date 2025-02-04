from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from .models import CustomUser
import json

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return JsonResponse({"error": "Username and password are required"}, status=400)

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"message": "Login successful"})
            else:
                return JsonResponse({"error": "Invalid username or password"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    def get(self, request):
        return JsonResponse({"error": "GET method not allowed"}, status=405)


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', 'Technician')  # Default role

            # Validate input data
            if not username or not email or not password:
                return JsonResponse({"error": "Username, email, and password are required"}, status=400)

            # Check if the username already exists
            if CustomUser.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username is already taken"}, status=400)

            # Check if the email already exists
            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email is already registered"}, status=400)

            # Create the user
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=role
            )
            return JsonResponse({"message": "User registered successfully"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    def get(self, request):
        return JsonResponse({"error": "GET method not allowed"}, status=405)
@method_decorator(csrf_exempt, name='dispatch')
class UserUpdateView(View):
    def patch(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            data = json.loads(request.body)

            # Update fields if provided in the request
            user.email = data.get('email', user.email)
            user.role = data.get('role', user.role)
            user.save()

            return JsonResponse({"message": "User updated successfully"}, status=200)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    def get(self, request, user_id):
        return JsonResponse({"error": "GET method not allowed"}, status=405)


@method_decorator(csrf_exempt, name='dispatch')
class UserDeleteView(View):
    def delete(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            user.delete()
            return JsonResponse({"message": "User deleted successfully"}, status=200)
        except CustomUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

    def get(self, request, user_id):
        return JsonResponse({"error": "GET method not allowed"}, status=405)

@method_decorator(csrf_exempt, name='dispatch')
class UserListView(View):
    def get(self, request):
        try:
            # Fetch all users
            users = CustomUser.objects.all()
            # Serialize the users
            user_list = [
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                }
                for user in users
            ]
            return JsonResponse(user_list, safe=False, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

