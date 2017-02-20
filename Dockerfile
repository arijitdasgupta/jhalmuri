FROM node:6.9.4

RUN ["mkdir", "app"]
COPY . app/
WORKDIR app
RUN echo 'Starting to make some jhalmuri'
RUN ["npm", "install"]
RUN ["npm", "run", "install:typings"]
RUN ["npm", "run", "build"]

CMD ["npm", "start"]