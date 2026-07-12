FROM node:22.20-bookworm-slim AS builder

WORKDIR /app

COPY . .

RUN npm --no-update-notifier --no-fund --global install pnpm@10.6.1

WORKDIR /app/landing

RUN pnpm install
RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /app/landing/out /usr/share/nginx/html

COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri.html \$uri/ =404;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
