# Generated manually to fix FK type compatibility

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Vote",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "target_type",
                    models.CharField(
                        choices=[
                            ("idea", "Idea"),
                            ("feedback", "Feedback"),
                            ("comment", "Comment"),
                        ],
                        max_length=20,
                    ),
                ),
                ("target_id", models.CharField(max_length=36)),  # Changed from UUIDField to CharField
                (
                    "value",
                    models.SmallIntegerField(
                        help_text="1 pour upvote, -1 pour downvote",
                        validators=[
                            django.core.validators.MinValueValidator(-1),
                            django.core.validators.MaxValueValidator(1),
                        ],
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="votes",
                        to=settings.AUTH_USER_MODEL,
                        db_constraint=True,
                    ),
                ),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["target_type", "target_id"],
                        name="votes_vote_target__cfdf89_idx",
                    ),
                    models.Index(
                        fields=["user", "target_type"],
                        name="votes_vote_user_id_465157_idx",
                    ),
                ],
                "unique_together": {("user", "target_type", "target_id")},
            },
        ),
    ]
