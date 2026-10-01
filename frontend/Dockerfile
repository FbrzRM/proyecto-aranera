FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @araneda/shared
RUN npm run build -w araneda-frontend

FROM nginx:alpine AS runtime
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY --from=build /app/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
