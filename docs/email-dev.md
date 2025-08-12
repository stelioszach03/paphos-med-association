# Dev email pipeline

Start Mailpit:

```
docker compose -f docker-compose.dev.yml up
```

Then POST a JSON payload to store an email:

```
curl -X POST -H "Content-Type: application/json" \
  -d '{"subject":"hi","from":"a@example.com","to":"b@example.com","snippet":"hello","html":"<p>hi</p>"}' \
  http://localhost:3000/api/admin/email/inbound
```

Open Mailpit UI at [http://localhost:8025](http://localhost:8025).
