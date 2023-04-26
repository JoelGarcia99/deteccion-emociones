CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "Usuario" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "email" varchar(256) UNIQUE NOT NULL,
  "emailRecuperacion" varchar(256),
  "password" char(64) NOT NULL,
  "nombre" varchar(200) NOT NULL,
  "fechaNacimiento" timestamptz,
  "refreshToken" text,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL
);

CREATE TABLE "Recurso" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "nombre" varchar(250) NOT NULL,
  "tipo" varchar(50) NOT NULL,
  "url" text,
  "embebido" text,
  "proposito" text
);

CREATE TABLE "Media" (
  "id" uuid primary key DEFAULT (uuid_generate_v4()),
  "url" text NOT NULL,
  "tipo" varchar(50) NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "Prediccion" (
  "usuarioId" uuid NOT NULL,
  "emocionDetectada" varchar(150) NOT NULL,
  "recursoId" uuid NOT NULL,
  "mediaId" uuid NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

COMMENT ON COLUMN "Recurso"."embebido" IS 'Si es un videojuego entonces es posible que este esté embebido en un HTML';

COMMENT ON COLUMN "Recurso"."proposito" IS 'Detalles del porqué el recurso puede ayudar al bebé';

COMMENT ON COLUMN "Prediccion"."recursoId" IS 'El recurso (video/imagen) recomendado para tratar al bebé';

COMMENT ON COLUMN "Prediccion"."mediaId" IS 'La imagen/video utilizada para realizar la predicción';

ALTER TABLE "Prediccion" ADD FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id");

ALTER TABLE "Prediccion" ADD FOREIGN KEY ("recursoId") REFERENCES "Recurso" ("id");

ALTER TABLE "Prediccion" ADD FOREIGN KEY ("mediaId") REFERENCES "Media" ("id");
