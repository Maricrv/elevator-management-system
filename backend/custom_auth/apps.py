from django.apps import AppConfig

class AuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'custom_auth'
    verbose_name = 'User Management'

    # Remove this if you are not using signals
    # def ready(self):
    #     import custom_auth.signals  # Optional: Load signals when the app starts
