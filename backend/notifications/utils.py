from notifications.models import Notification


def notify(user, notif_type, message, related_id=None):
    if not user:
        return
    try:
        Notification.objects.create(
            user=user,
            notif_type=notif_type,
            message=message,
            related_id=str(related_id) if related_id else None,
        )
    except Exception:
        pass
