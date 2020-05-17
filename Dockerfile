FROM node
COPY ./ /home
RUN cd /home/ \
    && npm install --registry=https://registry.npm.taobao.org
WORKDIR /home/
CMD [ "npm","start" ]
EXPOSE 10010
