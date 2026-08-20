CREATE TABLE "word_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word_set_id" uuid NOT NULL,
	"english_word" text NOT NULL,
	"ukrainian_translation" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "words" ADD CONSTRAINT "words_word_set_id_word_sets_id_fk" FOREIGN KEY ("word_set_id") REFERENCES "public"."word_sets"("id") ON DELETE cascade ON UPDATE no action;