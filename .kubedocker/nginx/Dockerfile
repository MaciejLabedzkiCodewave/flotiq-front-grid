FROM nginx:stable

COPY ./build /usr/share/nginx/html
RUN ls -l /usr/share/nginx/html
COPY ./.kubedocker/nginx/server_tokens.conf /etc/nginx/conf.d
COPY ./.kubedocker/nginx/default.conf /etc/nginx/conf.d
