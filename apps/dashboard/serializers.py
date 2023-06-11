"""
Serializers for dashboard app.
"""

from rest_framework import serializers

from core.models import Pdf


class PdfSerializer(serializers.ModelSerializer):
    """
    Serializer for Pdf model.
    """

    class Meta:
        model = Pdf
        fields = ("id", "name", "uploaded_by")
        read_only_fields = ("id", "uploaded_by")
