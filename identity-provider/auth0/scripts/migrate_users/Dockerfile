FROM python:3.9.7-slim
RUN pip install requests
WORKDIR /job
COPY ./ .
ENTRYPOINT ["python3", "./migrate.py"]