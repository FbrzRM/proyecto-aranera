FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @araneda/shared
RUN npm run build -w araneda-backend

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/shared ./shared
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/backend/dist ./backend/dist
EXPOSE 3000
CMD ["node", "backend/dist/index.js"]
