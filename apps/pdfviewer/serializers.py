"""
Serializers for pdfviewer app.
"""

from rest_framework import serializers

from core.models import Pdf, SharedPdf, Comments, Replies


class PdfSerializer(serializers.ModelSerializer):
    """
    Serializer for Pdf model.
    """

    class Meta:
        model = Pdf
        fields = ("id", "name", "uploaded_by")
        read_only_fields = ("id", "uploaded_by")


class SharedPdfSerializer(serializers.ModelSerializer):
    """
    Serializer for SharedPdf model.
    """

    class Meta:
        model = SharedPdf
        fields = ("id", "shared_to_email", "shared_to_name", "shared_at")
        read_only_fields = ("id", "shared_at")


class RepliesSerializer(serializers.ModelSerializer):
    """
    Serializer for Replies model.
    """

    class Meta:
        model = Replies
        fields = ("id", "reply", "email", "name", "replied_at")
        read_only_fields = ("id", "replied_at")


class CommentsSerializer(serializers.ModelSerializer):
    """
    Serializer for Comments model.
    """

    replies = RepliesSerializer(many=True, read_only=True)

    class Meta:
        model = Comments
        fields = ("id", "comment", "email", "name", "commented_at", "replies")
        read_only_fields = ("id", "commented_at")
