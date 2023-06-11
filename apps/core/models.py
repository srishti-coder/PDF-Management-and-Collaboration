"""
Database Models.
"""

import os
import uuid
import datetime

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone


class UserManager(BaseUserManager):
    """
    Manager for Users
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        create, save and return a new user.
        """

        if not email:
            raise ValueError("User must have a email address.")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """
        create, save and return new superuser.
        """

        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """
    User in the system.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"


def default_expiry_date():
    """
    Generate default expiry date for reset password token.
    """

    return timezone.now() + datetime.timedelta(hours=1)


class ResetPasswordToken(models.Model):
    """
    Model for storing reset password tokens.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expired_at = models.DateTimeField(default=default_expiry_date)
    password_changed = models.BooleanField(default=False)


def pdf_file_path(instance, filename):
    """
    Generate file path for new pdf.
    """

    ext = os.path.splitext(filename)[1]
    filename = f"{uuid.uuid4()}{ext}"

    return os.path.join("uploads/pdf/", filename)


class Pdf(models.Model):
    """
    Model for storing pdfs.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to=pdf_file_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)


class SharedPdf(models.Model):
    """Model for storing shared pdfs."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pdf = models.ForeignKey(Pdf, on_delete=models.CASCADE)
    shared_to_name = models.CharField(max_length=255)
    shared_to_email = models.EmailField(max_length=255)
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE)
    shared_at = models.DateTimeField(auto_now_add=True)


class Comments(models.Model):
    """
    Model for storing comments.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pdf = models.ForeignKey(Pdf, on_delete=models.CASCADE)
    comment = models.TextField()
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    shared_pdf = models.ForeignKey(
        SharedPdf, on_delete=models.CASCADE, null=True
    )
    commented_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    commented_at = models.DateTimeField(auto_now_add=True)


class Replies(models.Model):
    """
    Model for storing replies.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    comment = models.ForeignKey(
        Comments, on_delete=models.CASCADE, related_name="replies"
    )
    reply = models.TextField()
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    replied_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    replied_at = models.DateTimeField(auto_now_add=True)
