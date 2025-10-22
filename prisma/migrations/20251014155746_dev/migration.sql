-- CreateTable
CREATE TABLE "public"."Mention" (
    "id" TEXT NOT NULL,
    "Mention" TEXT NOT NULL,
    "Branche" TEXT NOT NULL,
    "Niveau" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "Matricule" INTEGER NOT NULL,
    "Nom" TEXT NOT NULL,
    "Prenom" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "MotDePasse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filePictureName" TEXT,
    "Role" TEXT NOT NULL,
    "MentionId" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("Matricule")
);

-- CreateTable
CREATE TABLE "public"."Administrateur" (
    "identifiant" INTEGER NOT NULL,
    "Nom" TEXT NOT NULL,
    "Prenom" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "MotDePasse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filePictureName" TEXT,
    "Role" TEXT NOT NULL,

    CONSTRAINT "Administrateur_pkey" PRIMARY KEY ("identifiant")
);

-- CreateTable
CREATE TABLE "public"."Tranche" (
    "id" TEXT NOT NULL,
    "Premier" BOOLEAN NOT NULL DEFAULT false,
    "Deuxieme" BOOLEAN NOT NULL DEFAULT false,
    "Troisieme" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentMatricule" INTEGER NOT NULL,

    CONSTRAINT "Tranche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "Nom" TEXT NOT NULL,
    "Titre" TEXT NOT NULL,
    "Professeur" TEXT NOT NULL,
    "MegaByte" INTEGER NOT NULL,
    "classeId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Titre" TEXT NOT NULL,
    "Fichier" TEXT,
    "Branche" TEXT NOT NULL,
    "Mention" TEXT NOT NULL,
    "Niveau" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_Matricule_MentionId_key" ON "public"."Student"("Matricule", "MentionId");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_MentionId_fkey" FOREIGN KEY ("MentionId") REFERENCES "public"."Mention"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tranche" ADD CONSTRAINT "Tranche_studentMatricule_fkey" FOREIGN KEY ("studentMatricule") REFERENCES "public"."Student"("Matricule") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "public"."Mention"("id") ON DELETE SET NULL ON UPDATE CASCADE;
 CREATE EXTENSION IF NOT EXISTS pg_trgm;