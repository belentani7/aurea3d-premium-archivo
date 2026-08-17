CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitId` int,
	`expenseType` enum('dieta_instalacion','dieta_prospección','kilometraje','material','otro') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`description` text,
	`receiptUrl` text,
	`date` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`sector` enum('industrial','nautica','arquitectura','otro') NOT NULL,
	`polygon` varchar(255),
	`status` enum('prospectado','reunion_tecnica','cotizacion_enviada','cerrado','rechazado') NOT NULL DEFAULT 'prospectado',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `legalCompliance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`month` int NOT NULL,
	`year` int NOT NULL,
	`actaConsejoRector` boolean DEFAULT false,
	`calendarioActividades` boolean DEFAULT false,
	`libroKilometraje` boolean DEFAULT false,
	`fotosTaller` boolean DEFAULT false,
	`anticipoSolicitado` boolean DEFAULT false,
	`anticipoAprobado` boolean DEFAULT false,
	`anticipoMonto` decimal(10,2) DEFAULT '0',
	`anticipoDevolucion` date,
	`dietasRegistradas` int DEFAULT 0,
	`dietasTotal` decimal(10,2) DEFAULT '0',
	`alquilerBase` decimal(10,2) DEFAULT '0',
	`cesionPorcentaje` int DEFAULT 45,
	`cesionMonto` decimal(10,2) DEFAULT '0',
	`notes` text,
	`status` enum('pendiente','en_progreso','completado','auditado') NOT NULL DEFAULT 'pendiente',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `legalCompliance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`quotationNumber` varchar(50),
	`engineeringHours` decimal(8,2) DEFAULT '0',
	`engineeringCost` decimal(10,2) DEFAULT '0',
	`materialCost` decimal(10,2) DEFAULT '0',
	`material` varchar(100),
	`postProcessingHours` decimal(8,2) DEFAULT '0',
	`postProcessingCost` decimal(10,2) DEFAULT '0',
	`totalCost` decimal(10,2) DEFAULT '0',
	`margin` int DEFAULT 30,
	`finalPrice` decimal(10,2) DEFAULT '0',
	`description` text,
	`status` enum('borrador','enviada','aceptada','rechazada') NOT NULL DEFAULT 'borrador',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotations_id` PRIMARY KEY(`id`),
	CONSTRAINT `quotations_quotationNumber_unique` UNIQUE(`quotationNumber`)
);
--> statement-breakpoint
CREATE TABLE `visits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`visitDate` date NOT NULL,
	`location` varchar(255) NOT NULL,
	`duration` int,
	`kilometers` decimal(8,2),
	`photoUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visits_id` PRIMARY KEY(`id`)
);
