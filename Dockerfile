# Etapa 1: Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa 2: Producción
FROM node:18 AS production

WORKDIR /app

# Instala serve para servir estáticos
RUN npm install -g serve

# Copia el resultado del build
COPY --from=build /app/build ./build

EXPOSE 3000

# Comando para iniciar el servidor
CMD ["serve", "-s", "build", "-l", "3000"]



