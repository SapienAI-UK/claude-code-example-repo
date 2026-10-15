CREATE TABLE `status_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`line_id` text NOT NULL,
	`line_name` text NOT NULL,
	`mode` text NOT NULL,
	`status_severity` integer NOT NULL,
	`status_description` text NOT NULL,
	`reason` text,
	`is_synthetic` integer DEFAULT false NOT NULL,
	`polled_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_snapshots_polled_at` ON `status_snapshots` (`polled_at`);--> statement-breakpoint
CREATE INDEX `idx_snapshots_line_id` ON `status_snapshots` (`line_id`);