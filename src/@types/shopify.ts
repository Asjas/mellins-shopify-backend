export enum CONTACT_LENS_VENDORS {
  ACUVUE = "Acuvue",
  COOPERVISION = "CooperVision",
}

export enum SHOPIFY_TAGS {
  MELLINS_CUSTOMER = "MELLINS_CUSTOMER",
  MELLINS_PRACTICE = "MELLINS_PRACTICE",
  CONTACT_LENSES = "CONTACT_LENSES",
  INTERNAL_ORDER = "INTERNAL_ORDER",
  NEEDS_REVIEW = "NEEDS_REVIEW",
  APPROVED = "APPROVED",
  REFUND_REQUESTED = "REFUND_REQUESTED",
  IBT_REQUESTED = "IBT_REQUESTED",
  VOUCHER_REQUESTED = "VOUCHER_REQUESTED",
  AWAITING_DELIVERY = "AWAITING DELIVERY",
  ORDER_READY = "ORDER_READY",
}

export interface LOCAL_ORDER_DATA {
  lastExaminationDate: string;
  nextExaminationDate: string;
  lastPurchaseDate: string;
  patientHistory: string;
  riskCategory: string;
  productVerified: string;
  prescriptionVerified: string;
  dateOfPhonecall: string;
  timeOfPhonecall: string;
  notesOfPhonecall: string;
  orderReferenceNumber: string;
  ibtTagNumbers: string;
  patientArrangement: string;
  optometristName: string;
  orderApproved: string;
}
