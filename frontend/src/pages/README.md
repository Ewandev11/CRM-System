Multi-Tenant CRM SaaS Portal

A CRM system designed to maintain data separation between organizations, track system activity, and handle file storage securely.

Architecture & Engineering Decisions

1. Multi-Tenant Isolation

* A shared database is used with logical separation between organizations.
* All models are linked to an organization through a base model.
* Querysets are filtered based on the authenticated user’s organization to ensure users can  only access their own data.

2. AWS S3 Storage

* Files are stored in a private S3 bucket.
* Presigned URLs are used to provide temporary access to files instead of public links.

3. Activity Logging

* Create, update, and delete actions on key entities are logged.
* Each log records the user and timestamp for tracking changes.

4. API Features

* Soft delete is used so records are not permanently removed.
* Email addresses are required to be unique within the same company.

Tech Stack

* Backend: Django, Django REST Framework, PostgreSQL
* Frontend: React (Context API), Axios
* Infrastructure: AWS S3, JWT Authentication

Local Setup

1.Rename .env.example to .env and configure database and AWS credentials.
2.Run:

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver