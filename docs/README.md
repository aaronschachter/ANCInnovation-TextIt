# API

These endpoints use [basic authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#Basic_authentication_scheme) to authenticate.

## Subscriber Groups

```
POST /api/v1/subscriberGroups
```

This endpoint paginates through all contacts in an "All Subscribers" TextIt group, and adds them into new groups it creates, each with maximum size 100 contacts.

**Example request:**

```
curl --location --request POST 'http://localhost:8080/api/v1/subscriberGroups' \
--header 'Accept: application/json' \
--header 'Authorization: Basic [Your base64 encoded username and password]' \
--header 'Content-Type: application/json' \
```

**Example response:**

```
{
    "numberOfSubscribers": 736,
    "numberOfGroups": 8,
    "groups": [
        {
            "uuid": "f940b2dd-a7db-4cc3-9a6d-1d15919d8dc1",
            "name": "Subscribers Batch 1",
            "count": 92
        },
        {
            "uuid": "d4562019-7529-4aa4-a59c-f886b44b9810",
            "name": "Subscribers Batch 2",
            "count": 92
        },
        {
            "uuid": "d5a7290c-d3d2-40ca-994d-e6fa3831b2c6",
            "name": "Subscribers Batch 3",
            "count": 92
        },
        {
            "uuid": "2bd12781-67e5-417d-9732-5b8c03c4abcb",
            "name": "Subscribers Batch 4",
            "count": 92
        },
        {
            "uuid": "ee453467-b8ce-4065-817e-ecead4bb89b7",
            "name": "Subscribers Batch 5",
            "count": 92
        },
        {
            "uuid": "99cf6f5c-2a02-40c8-a820-c20806c2f768",
            "name": "Subscribers Batch 6",
            "count": 92
        },
        {
            "uuid": "6711e7a2-3831-4fea-9dd9-b06d49839fd8",
            "name": "Subscribers Batch 7",
            "count": 92
        },
        {
            "uuid": "7c0be991-014b-4bf1-9705-d3ef21bdd1af",
            "name": "Subscribers Batch 8",
            "count": 92
        }
    ]
}
```

## Inbox

```
POST /api/v1/inbox
```

This endpoint is still under construction, but will be used within flows to forward inbound messages to external services.

It currently only supports forwarding messages to a Zapier webhook.

**Example request:**

```
curl --location --request POST 'http://localhost:8080/api/v1/subscriberGroups' \
--header 'Accept: application/json' \
--header 'Authorization: Basic [Your base64 encoded username and password]' \
--header 'Content-Type: application/json' \
--data-raw '{
    "contact": {
        "name": "",
        "urn": "tel:+12065551212",
        "uuid": "f438c4c6-dc86-4eda-a0d0-48db703065d5"
    },
    "flow": {
        "name": "Admin: Aaron Test",
        "uuid": "b2155c34-c7dc-46bd-bb76-fa53480f50ed"
    },
    "results": {
        "result": {
            "category": "Has Text",
            "value": "Hello there"
        }
```
