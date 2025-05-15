/** @format */

export const isSigned = (doc) => !!doc.verified_at;

export const canRegistrarOrClerkSign = (userRole, doc) =>
  ["Registrar", "Clerk"].includes(userRole) &&
  doc.document_status === "Signed";

export const canJudgeSign = (userRole, doc) =>
  userRole === "Judge" &&
  doc.document_status === "Verified" &&
  doc.verified_at == null;
