-- CreateTable
CREATE TABLE "public"."Student" (
    "Matricule" INTEGER NOT NULL,
    "Nom" TEXT NOT NULL,
    "Prenom" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "Mention" TEXT NOT NULL,
    "Branche" TEXT NOT NULL,
    "Niveau" TEXT NOT NULL,
    "MotDePasse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("Matricule")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "Nom" TEXT NOT NULL,
    "Titre" TEXT NOT NULL,
    "Niveau" TEXT NOT NULL,
    "Professeur" TEXT NOT NULL,
    "Mention" TEXT NOT NULL,
    "Branche" TEXT NOT NULL,
    "MegaByte" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
