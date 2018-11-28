#!/bin/sh

# Migrate DB
echo Migrating DB...
python manage.py migrate

# Create admin user
echo Creating admin user...
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('$DJANGO_SU_NAME', '$DJANGO_SU_EMAIL', '$DJANGO_SU_PASSWORD')" | python manage.py shell

# Start Gunicorn processes
echo Starting Gunicorn...
exec gunicorn django_kubernetes.wsgi:application \
    --bind :8000 \
    --workers 5