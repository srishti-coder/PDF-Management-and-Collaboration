"""
Core URL mappings.
"""
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from core import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="api-schema"),
        name="api-docs",
    ),
    path("", views.Authentication.as_view(), name="domain_url"),
    path(
        "authentication",
        views.Authentication.as_view(),
        name="authentication_page",
    ),
    path("api/user/", include("user.urls"), name="user_model_apis"),
    path(
        "authentication/resetpassword/",
        views.ResetPassword.as_view(),
        name="reset_password_page",
    ),
    path("dashboard", views.Dashboard.as_view(), name="dashboard_page"),
    path("api/dashboard/", include("dashboard.urls"), name="dashboard_apis"),
    path(
        "pdfviewer/<str:pdfId>",
        views.PdfViewer.as_view(),
        name="pdf_viewer_page",
    ),
    path("api/pdfviewer/", include("pdfviewer.urls"), name="pdfviewer_apis"),
    path(
        "pdfviewer/shared/<str:sharedId>",
        views.SharedPdfViewer.as_view(),
        name="shared_pdf_viewer_page",
    ),
]

if settings.DEBUG:
    """
    Mimicing behaviour of staticfiles urlpatterns for mediafiles as well
    in development server as mediafiles are not managed by default.
    """
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )

    # Adding url pattern for django debug toolbar
    urlpatterns.append(path("__debug__/", include("debug_toolbar.urls")))
