-- CreateTable
CREATE TABLE "rider"."cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "pinCodeRange" TEXT,
    "regionCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOperational" BOOLEAN NOT NULL DEFAULT true,
    "launchDate" TIMESTAMP(3),
    "estimatedPopulation" INTEGER,
    "marketPotential" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastModifiedBy" TEXT,
    "eventSequence" INTEGER NOT NULL DEFAULT 0,
    "lastSyncAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rider"."riders" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "registrationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "dob" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "emergencyName" TEXT,
    "emergencyPhone" TEXT,
    "emergencyRelation" TEXT,
    "kycStatus" TEXT NOT NULL DEFAULT 'pending',
    "aadhaar" TEXT,
    "pan" TEXT,
    "dl" TEXT,
    "selfie" TEXT,
    "assignedVehicleId" TEXT,
    "assignmentDate" TIMESTAMP(3),
    "hubId" TEXT,
    "assignedStoreId" TEXT,
    "assignedClientId" TEXT,
    "storeAssignmentDate" TIMESTAMP(3),
    "storeAssignmentNotes" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "consentLogs" TEXT,
    "ip" TEXT,
    "agreementSigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rider"."rider_vehicle_history" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),
    "assignedBy" TEXT NOT NULL,
    "returnedBy" TEXT,
    "registrationNumber" TEXT NOT NULL,
    "vehicleMake" TEXT,
    "vehicleModel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "hubId" TEXT,
    "startMileage" INTEGER,
    "endMileage" INTEGER,
    "batteryPercentageStart" INTEGER,
    "batteryPercentageEnd" INTEGER,
    "conditionOnAssign" TEXT,
    "conditionOnReturn" TEXT,
    "damagesReported" TEXT,
    "riderFeedback" TEXT,
    "issuesReported" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rider_vehicle_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rider"."kyc_documents" (
    "id" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentTypeDisplay" TEXT,
    "documentNumber" TEXT,
    "documentImageUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "verificationDate" TIMESTAMP(3),
    "verificationNotes" TEXT,
    "verifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kyc_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rider"."OtpVerification" (
    "id" TEXT NOT NULL,
    "tempId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "requestId" TEXT NOT NULL DEFAULT '',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "rider"."cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_code_key" ON "rider"."cities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "riders_phone_key" ON "rider"."riders"("phone");

-- CreateIndex
CREATE INDEX "rider_vehicle_history_riderId_idx" ON "rider"."rider_vehicle_history"("riderId");

-- CreateIndex
CREATE INDEX "rider_vehicle_history_vehicleId_idx" ON "rider"."rider_vehicle_history"("vehicleId");

-- CreateIndex
CREATE INDEX "rider_vehicle_history_status_idx" ON "rider"."rider_vehicle_history"("status");

-- CreateIndex
CREATE INDEX "rider_vehicle_history_assignedAt_idx" ON "rider"."rider_vehicle_history"("assignedAt");

-- CreateIndex
CREATE INDEX "kyc_documents_riderId_idx" ON "rider"."kyc_documents"("riderId");

-- CreateIndex
CREATE INDEX "kyc_documents_documentType_idx" ON "rider"."kyc_documents"("documentType");

-- CreateIndex
CREATE INDEX "kyc_documents_verificationStatus_idx" ON "rider"."kyc_documents"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "OtpVerification_tempId_key" ON "rider"."OtpVerification"("tempId");

-- AddForeignKey
ALTER TABLE "rider"."rider_vehicle_history" ADD CONSTRAINT "rider_vehicle_history_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "rider"."riders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rider"."kyc_documents" ADD CONSTRAINT "kyc_documents_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "rider"."riders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
