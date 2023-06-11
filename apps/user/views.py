"""
Views for user API.
"""

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework import generics, authentication, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from user.serializer import UserSerializer, AuthTokenSerializer
from core.models import SharedPdf, Comments, ResetPasswordToken


class CreateUserView(generics.CreateAPIView):
    """
    Create a new user in system.
    """

    serializer_class = UserSerializer

    def post(self, request, format=None):
        """
        Create a new user.
        """

        email = request.data["email"]
        name = request.data["name"]
        SharedPdf.objects.filter(shared_to_email=email).update(
            shared_to_name=name
        )
        Comments.objects.filter(email=email).update(name=name)
        return super().post(request, format=None)


class CreateTokenView(ObtainAuthToken):
    """
    Create a new auth token for user.
    """

    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES


class ManageUserView(generics.RetrieveUpdateAPIView):
    """
    Manage the authenticated user.
    """

    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class CheckUserAvailabilityView(APIView):
    """
    View for checking user availability.
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        Check if user is available in db.
        """

        email = request.GET.get("email", None)
        User = get_user_model()
        user = User.objects.filter(email=email).first()
        if user:
            return Response({"name": user.name, "email": user.email})
        return Response({"message": "User is not available"})


class ForgotPasswordView(APIView):
    """
    View for forgot password.
    """

    def post(self, request, format=None):
        """
        Send recovery email to user.
        """

        email = request.data["email"]
        User = get_user_model()
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"message": "User is not available"}, status=404)

        instance = ResetPasswordToken.objects.create(user=user)

        current_domain = request.META["HTTP_HOST"]
        reset_link = (
            f"http://{current_domain}/authentication/resetpassword"
            + f"?token={instance.token}"
        )

        subject = "Reset Password"
        message = f"Hi {user.name} "
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [email]

        html_message = render_to_string(
            "mail/resetpassword.html",
            {
                "recipient_name": user.name,
                "reset_link": reset_link,
            },
        )

        send_mail(
            subject,
            message,
            email_from,
            recipient_list,
            html_message=html_message,
        )

        return Response({"message": "Recovery email sent"})


class ResetPasswordView(APIView):
    """
    View for reset password.
    """

    def post(self, request, format=None):
        """
        Reset password.
        """

        token = request.data["token"]
        password = request.data["password"]
        instance = ResetPasswordToken.objects.filter(token=token).first()
        user = instance.user
        if not user:
            return Response({"message": "Invalid token"}, status=400)
        if user.check_password(password):
            return Response(
                {"message": "New password cannot be old password"}, status=400
            )
        if instance.password_changed:
            return Response(
                {"message": "Password already changed"}, status=400
            )
        if timezone.now() > instance.expired_at:
            return Response({"message": "Token expired"}, status=400)

        user.set_password(password)
        user.save()

        instance.password_changed = True
        instance.save()

        return Response({"message": "Password changed successfully"})
