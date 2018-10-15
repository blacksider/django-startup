from django.db import models


# Create your models here.
class Tree(models.Model):
    name = models.CharField(max_length=100, null=False)
    age = models.IntegerField(default=0)
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '"test_tree"'
        ordering = ('-update_time',)
