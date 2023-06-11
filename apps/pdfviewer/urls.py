"""
URL Mapping for the pdfviewer app.
"""

from django.urls import path

from pdfviewer import views

app_name = "pdfviewer"

urlpatterns = [
    path("getpdf/<str:id>/", views.PdfFileView.as_view(), name="get_pdf"),
    path(
        "getsharedpdf/<str:id>/",
        views.SharedPdfFileView.as_view(),
        name="get_shared_pdf",
    ),
    path("inviteviewer/", views.PdfInviteView.as_view(), name="invite"),
    path(
        "getsharedviewers/",
        views.PdfInviteView.as_view(),
        name="viewers",
    ),
    path(
        "revokeaccess/<str:id>/", views.PdfInviteView.as_view(), name="revoke"
    ),
    path("addcomment/", views.CommentsView.as_view(), name="add_comment"),
    path(
        "getcomments/",
        views.CommentsView.as_view(),
        name="get_comments",
    ),
    path(
        "deletecomment/<str:id>/",
        views.CommentsView.as_view(),
        name="delete_comment",
    ),
    path("addreply/", views.RepliesView.as_view(), name="add_reply"),
    path(
        "deletereply/<str:id>/",
        views.RepliesView.as_view(),
        name="delete_reply",
    ),
]
