FROM python:3.9-alpine3.13
# alpine 3.13 - node 14.

LABEL maintainer="savss624"

ENV PYTHONUNBUFFERED 1
ENV APP_HOME /pdfcolab

COPY . $APP_HOME

WORKDIR $APP_HOME
EXPOSE 8000

ARG DEV=false
RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    apk add --update --no-cache postgresql-client jpeg-dev && \
    apk add --update --no-cache --virtual .tmp-build-deps \
        build-base postgresql-dev musl-dev zlib zlib-dev linux-headers && \
    /py/bin/pip install -r requirements.txt && \
    if [ $DEV = "true" ]; \
        then /py/bin/pip install -r requirements.dev.txt ; \
    fi && \
    apk add --update --no-cache nodejs yarn && \
    yarn install --frozen-lockfile --modules-folder /node_modules && \
    rm -f requirements*.txt && \
    apk del .tmp-build-deps && \
    adduser \
        --disabled-password \
        --no-create-home \
        local-user && \
    mkdir -p build && \
    mkdir -p /vol/web/mediafiles && \
    mkdir -p /vol/web/staticfiles && \
    chown -R local-user:local-user build /vol && \
    chmod -R 755 build /vol && \
    chmod -R +x scripts

ENV PYTHON_PATH /py/bin
ENV NODE_PATH /node_modules/.bin
ENV SCRIPTS_PATH scripts

ENV PATH $SCRIPTS_PATH:$PYTHON_PATH:$NODE_PATH:$PATH

USER local-user

CMD ["run.sh"]