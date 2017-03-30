FROM node:6.9.4

RUN ["mkdir", "app"]
COPY . app/
WORKDIR app
RUN echo 'Starting to make some jhalmuri'
RUN ["yarn"]
RUN ["yarn", "run", "install:typings"]
RUN ["yarn", "run", "build"]

CMD ["yarn", "start"]
