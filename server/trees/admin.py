from django.contrib import admin

# Register your models here.
from server.trees import models

admin.site.register(models.Tree)