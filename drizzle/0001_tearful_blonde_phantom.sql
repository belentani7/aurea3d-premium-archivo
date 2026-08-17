ALTER TABLE `automations` MODIFY COLUMN `isActive` int NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `leads` MODIFY COLUMN `status` enum('new','contacted','qualified','converted','lost') NOT NULL DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `portfolioProjects` MODIFY COLUMN `featured` int NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolioProjects` MODIFY COLUMN `featured` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `leads` ADD `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `company` varchar(255);--> statement-breakpoint
ALTER TABLE `leads` ADD `source` varchar(100);--> statement-breakpoint
ALTER TABLE `leads` DROP COLUMN `companyName`;--> statement-breakpoint
ALTER TABLE `leads` DROP COLUMN `contactName`;--> statement-breakpoint
ALTER TABLE `leads` DROP COLUMN `sector`;--> statement-breakpoint
ALTER TABLE `leads` DROP COLUMN `polygon`;