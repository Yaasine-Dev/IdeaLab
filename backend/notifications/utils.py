from notifications.models import Notification


def notify(user, type, message, related_id=None):
    """Create a notification, skip if user is None."""
    if not user:
        return
    Notification.objects.create(
        user=user,
        type=type,
        message=message,
        related_id=related_id,
    )
