-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'INSTITUTE', 'INSTITUTE_MOD', 'ADMIN');

-- CreateEnum
CREATE TYPE "OnboardingStatus" AS ENUM ('ONBOARDED', 'INPROGRESS', 'PENDING');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BatchDurationType" AS ENUM ('YEAR', 'MONTH', 'WEEK', 'DAY');

-- CreateEnum
CREATE TYPE "StudentScoreType" AS ENUM ('PERCENTAGE', 'CGPA', 'GRADES');

-- CreateEnum
CREATE TYPE "CourseScoreType" AS ENUM ('CGPA', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "ProgramDurationType" AS ENUM ('SEMESTER', 'YEAR');

-- CreateEnum
CREATE TYPE "ProgramLevel" AS ENUM ('UG', 'PG', 'PHD');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailToken" TEXT,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "role" "Role" NOT NULL,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "instituteId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institute" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "status" "OnboardingStatus" NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" SERIAL NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "durationType" "BatchDurationType" NOT NULL,
    "status" "BatchStatus" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "uniId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "batchId" INTEGER,
    "instituteId" INTEGER,
    "departmentId" INTEGER,
    "courseId" INTEGER,
    "skills" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentBasics" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "primaryEmail" TEXT NOT NULL,
    "secondaryEmail" TEXT,
    "permanentAddress" JSONB NOT NULL DEFAULT '{}',
    "currentAddress" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "StudentBasics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentScore" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "aggregatePercentage" TEXT NOT NULL,
    "currentTerm" INTEGER NOT NULL,
    "hasGraduated" BOOLEAN NOT NULL DEFAULT false,
    "lateralEntry" BOOLEAN NOT NULL,
    "hasBacklog" BOOLEAN NOT NULL,
    "totalBacklogs" INTEGER NOT NULL DEFAULT 0,
    "backlogDetails" JSONB NOT NULL DEFAULT '{}',
    "scores" JSONB NOT NULL DEFAULT '{}',
    "courseStartedAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedOn" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "StudentScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentEducation" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "school" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "scorePercentage" TEXT NOT NULL,
    "scoreType" "StudentScoreType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "isOngoing" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedOn" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "StudentEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentWorkExperience" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isCurriculum" BOOLEAN NOT NULL,
    "jobType" TEXT NOT NULL,
    "companySector" TEXT NOT NULL,
    "stipend" TEXT,
    "notes" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "isOngoing" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedOn" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "StudentWorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProject" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "isOngoing" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedOn" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "StudentProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCeritification" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT,
    "institute" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "identificationNumber" TEXT,
    "expiresAt" TIMESTAMP(3),
    "score" TEXT,
    "scoreType" "StudentScoreType",
    "description" TEXT,

    CONSTRAINT "StudentCeritification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "inCharge" TEXT,
    "instituteId" INTEGER,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "instituteId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "branchName" TEXT NOT NULL,
    "branchCode" TEXT NOT NULL,
    "scoreType" "CourseScoreType" NOT NULL,
    "programName" TEXT NOT NULL,
    "programDurationType" "ProgramDurationType" NOT NULL,
    "programDuration" INTEGER NOT NULL,
    "programLevel" "ProgramLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_instituteId_key" ON "Account"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_studentId_key" ON "Account"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_code_key" ON "Student"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StudentBasics_studentId_key" ON "StudentBasics"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentBasics_primaryEmail_key" ON "StudentBasics"("primaryEmail");

-- CreateIndex
CREATE UNIQUE INDEX "StudentBasics_secondaryEmail_key" ON "StudentBasics"("secondaryEmail");

-- CreateIndex
CREATE UNIQUE INDEX "StudentScore_studentId_key" ON "StudentScore"("studentId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBasics" ADD CONSTRAINT "StudentBasics_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentScore" ADD CONSTRAINT "StudentScore_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEducation" ADD CONSTRAINT "StudentEducation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentWorkExperience" ADD CONSTRAINT "StudentWorkExperience_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProject" ADD CONSTRAINT "StudentProject_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCeritification" ADD CONSTRAINT "StudentCeritification_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
