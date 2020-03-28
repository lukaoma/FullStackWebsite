FROM python:buster
WORKDIR /app

ADD . /app
RUN make deps
EXPOSE 5000

ENTRYPOINT [ "make" ]
CMD ["start"]