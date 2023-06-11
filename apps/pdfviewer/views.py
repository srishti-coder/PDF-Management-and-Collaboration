"""
Views for pdfviewer api.
"""

import os

from django.conf import settings
from django.http import FileResponse
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.db.models import Prefetch
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from core.models import Pdf, SharedPdf, Comments, Replies

from pdfviewer.serializers import (
    SharedPdfSerializer,
    CommentsSerializer,
    RepliesSerializer,
)


class PdfFileView(APIView):
    """
    View for getting pdf file.
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        """
        Get pdf file.
        """

        pdf = Pdf.objects.get(id=id)

        pdf_path = os.path.join(
            settings.MEDIA_ROOT, pdf.file.url.removeprefix("/media/")
        )
        pdf = open(pdf_path, "rb")
        return FileResponse(pdf, content_type="application/pdf")


class SharedPdfFileView(APIView):
    """
    View for getting shared pdf file.
    """

    def get(self, request, id, format=None):
        """
        Get shared pdf file.
        """

        shared_pdf = SharedPdf.objects.get(id=id)
        pdf = shared_pdf.pdf
        pdf_path = os.path.join(
            settings.MEDIA_ROOT, pdf.file.url.removeprefix("/media/")
        )
        pdf = open(pdf_path, "rb")
        return FileResponse(pdf, content_type="application/pdf")


class PdfInviteView(APIView):
    """
    View for inviting a viewer.
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        """
        Invite a viewer.
        """

        pdf = Pdf.objects.get(id=request.data["pdfId"])
        shared_to_email = request.data["sharedToEmail"]
        shared_to_name = request.data["sharedToName"]
        shared_by = request.user

        if shared_to_email == shared_by.email:
            return Response(
                {"message": "You cannot invite yourself."}, status=400
            )

        shared_pdf = SharedPdf.objects.create(
            pdf=pdf,
            shared_to_email=shared_to_email,
            shared_to_name=shared_to_name,
            shared_by=shared_by,
        )

        current_domain = request.META["HTTP_HOST"]
        invitation_link = (
            f"http://{current_domain}/pdfviewer/shared/{shared_pdf.id}"
        )

        subject = "PDFColab Invitation"
        message = f"Hi {request.user.name}"
        email_from = settings.EMAIL_HOST_USER
        recipient_list = [
            shared_to_email,
        ]

        html_message = render_to_string(
            "mail/pdfcolab_invitation.html",
            {
                "recipient_name": shared_to_name,
                "pdf_owner_name": request.user.name,
                "project_name": pdf.name,
                "invitation_link": invitation_link,
            },
        )

        send_mail(
            subject,
            message,
            email_from,
            recipient_list,
            html_message=html_message,
        )

        return Response({"sharedId": shared_pdf.id})

    def get(self, request, format=None):
        """
        Get all invited viewers.
        """

        pdf_id = request.GET.get("pdf_id")
        shared_pdfs = SharedPdf.objects.filter(pdf__id=pdf_id).order_by(
            "-shared_at"
        )
        serializer = SharedPdfSerializer(shared_pdfs, many=True)
        return Response({"viewers": serializer.data})

    def delete(self, request, id, format=None):
        shared_pdf = SharedPdf.objects.filter(id=id).first()
        shared_pdf.delete()

        return Response({"message": "Viewer has been deleted."}, status=200)


class CommentsView(APIView):
    """
    View for comments.
    """

    def post(self, request, format=None):
        """
        Post a comment.
        """

        pdf = Pdf.objects.get(id=request.data["pdfId"])
        comment = request.data["comment"]
        name = request.data["name"]
        email = request.data["email"]
        shared_id = request.data["sharedId"]
        is_shared = True if shared_id else False
        shared_pdf = SharedPdf.objects.get(id=shared_id) if is_shared else None
        User = get_user_model()
        commented_by = User.objects.get(email=email) if not is_shared else None
        comment = Comments.objects.create(
            pdf=pdf,
            comment=comment,
            name=name,
            email=email,
            shared_pdf=shared_pdf,
            commented_by=commented_by,
        )
        serializer = CommentsSerializer(comment)

        return Response(serializer.data)

    def get(self, request, format=None):
        """
        Get all comments along with replies.
        """

        pdf_id = request.GET.get("pdf_id")
        pdf = Pdf.objects.get(id=pdf_id)
        comments_queryset = Comments.objects.filter(pdf=pdf).order_by(
            "-commented_at"
        )
        replies_prefetch = Prefetch(
            "replies", queryset=Replies.objects.order_by("-replied_at")
        )
        comments = comments_queryset.prefetch_related(replies_prefetch)

        serializer = CommentsSerializer(comments, many=True)

        return Response({"comments": serializer.data})

    def delete(self, request, id, format=None):
        """
        Delete a comment.
        """

        comment = Comments.objects.filter(id=id).first()
        comment.delete()

        return Response({"message": "Comment has been deleted."}, status=200)


class RepliesView(APIView):
    """
    View for replies.
    """

    def post(self, request, format=None):
        """
        Post a reply.
        """

        comment = Comments.objects.get(id=request.data["commentId"])
        reply = request.data["reply"]
        name = request.data["name"]
        email = request.data["email"]
        shared_id = request.data["sharedId"]
        is_shared = True if shared_id else False
        User = get_user_model()
        replied_by = User.objects.get(email=email) if not is_shared else None
        reply = Replies.objects.create(
            comment=comment,
            reply=reply,
            name=name,
            email=email,
            replied_by=replied_by,
        )
        serializer = RepliesSerializer(reply)

        return Response(serializer.data)

    def delete(self, request, id, format=None):
        """
        Delete a reply.
        """

        reply = Replies.objects.filter(id=id).first()
        reply.delete()

        return Response({"message": "Reply has been deleted."}, status=200)
