CREATE TABLE "person" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "first_name" varchar,
  "last_name" varchar,
  "email" varchar UNIQUE,
  "role" varchar NOT NULL,
  "address_id" int UNIQUE
);

CREATE TABLE "form" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar,
  "user_id" int NOT NULL,
  "description" varchar(512) NOT NULL,
  "form_type" varchar NOT NULL,
  "resource_type" varchar(255),
  "resource_quantity" int
);

CREATE TABLE "employee_response" (
  "id" SERIAL PRIMARY KEY,
  "form_id" int NOT NULL,
  "author_id" int NOT NULL,
  "content" varchar(512) NOT NULL
);

CREATE TABLE "landfill" (
  "id" SERIAL PRIMARY KEY,
  "address_id" int UNIQUE NOT NULL,
  "working_hours_start" time NOT NULL,
  "working_hours_end" time NOT NULL
);

CREATE TABLE "landfill_waste_types" (
  "id" SERIAL PRIMARY KEY,
  "landfill_id" int NOT NULL,
  "waste_types" varchar(255) NOT NULL
);

CREATE TABLE "garbage_collection" (
  "id" SERIAL PRIMARY KEY,
  "time" timestamp NOT NULL
);

CREATE TABLE "garbage_collection_addresses" (
  "id" SERIAL PRIMARY KEY,
  "addresses_id" int NOT NULL,
  "collections_id" int NOT NULL
);

CREATE TABLE "location" (
  "id" SERIAL PRIMARY KEY,
  "city" varchar NOT NULL,
  "street" varchar NOT NULL,
  "number" varchar
);

CREATE TABLE "product" (
  "id" SERIAL PRIMARY KEY,
  "waste_type" varchar NOT NULL,
  "name" varchar UNIQUE NOT NULL
);

ALTER TABLE "person" ADD FOREIGN KEY ("address_id") REFERENCES "location" ("id");

ALTER TABLE "form" ADD FOREIGN KEY ("user_id") REFERENCES "person" ("id") ON DELETE CASCADE;

ALTER TABLE "employee_response" ADD FOREIGN KEY ("form_id") REFERENCES "form" ("id") ON DELETE CASCADE;

ALTER TABLE "employee_response" ADD FOREIGN KEY ("author_id") REFERENCES "person" ("id") ON DELETE SET NULL;

ALTER TABLE "landfill" ADD FOREIGN KEY ("address_id") REFERENCES "location" ("id");

ALTER TABLE "landfill_waste_types" ADD FOREIGN KEY ("landfill_id") REFERENCES "landfill" ("id") ON DELETE CASCADE;

ALTER TABLE "garbage_collection_addresses" ADD FOREIGN KEY ("addresses_id") REFERENCES "location" ("id") ON DELETE CASCADE;

ALTER TABLE "garbage_collection_addresses" ADD FOREIGN KEY ("collections_id") REFERENCES "garbage_collection" ("id") ON DELETE CASCADE;
