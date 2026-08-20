ALTER TABLE "word_sets" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "difficulty" text;--> statement-breakpoint
ALTER TABLE "words" ADD COLUMN "example_sentence" text;