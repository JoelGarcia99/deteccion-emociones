alter table "Prediccion" add column "id" uuid default uuid_generate_v4();

-- adding "id" as the primary key
alter table "Prediccion" add primary key ("id");

-- migrating the "mediaId" to the media table and renamed for "prediccionId"
alter table "Prediccion" drop column "mediaId";
alter table "Media" add column "prediccionId" uuid;

-- adding foreign key
alter table "Media" add foreign key ("prediccionId") references "Prediccion" ("id");
