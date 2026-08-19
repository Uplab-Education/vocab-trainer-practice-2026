ALTER TABLE "word_sets" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "word_sets" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "words" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "words" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "words" ALTER COLUMN "word_set_id" SET DATA TYPE text;