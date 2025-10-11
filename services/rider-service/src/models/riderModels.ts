// This is a custom models file to extend Prisma types
// Use this to help transition during the schema update

import { Rider as PrismaRider } from "@prisma/client";

// Extended Rider type with isActive field
export interface Rider extends PrismaRider {
  isActive: boolean;
}

// Helper function to map database riders to the extended type
export function mapRider(rider: PrismaRider): Rider {
  // Compute isActive from registrationStatus (if isActive not yet in DB)
  const isActive = (rider as any).isActive ?? rider.registrationStatus === "COMPLETED";

  return {
    ...rider,
    isActive,
  };
}
