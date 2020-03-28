FROM node:lts-buster
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

ADD . /app
RUN make deps
EXPOSE 3000

ENTRYPOINT [ "make" ]
CMD ["start"]