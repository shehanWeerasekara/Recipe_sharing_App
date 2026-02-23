FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make sure static folder exists
RUN mkdir -p /app/static

EXPOSE 8002

# We run migrations at startup (or you can run them manually first)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]