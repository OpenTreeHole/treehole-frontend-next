FROM node:lts-alpine as builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml /app/

RUN pnpm install --frozen-lockfile

COPY . /app

RUN pnpm build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

ADD default.conf /etc/nginx/conf.d/

COPY --from=builder /app/dist /usr/share/nginx/html

COPY ./entryPoint.sh /
RUN chmod +x entryPoint.sh

EXPOSE 80

ENTRYPOINT ["sh","/entryPoint.sh"]
CMD ["nginx", "-g", "daemon off;"]