set DJANGO_DEBUG=1
cd backend
celery -A jabberwocky worker -l info -P gevent
