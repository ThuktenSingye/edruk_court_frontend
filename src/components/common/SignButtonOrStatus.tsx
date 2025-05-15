/** @format */

import React from "react";
import {
  isSigned,
  canRegistrarOrClerkSign,
  canJudgeSign,
} from "../../lib/signingPermission";


import {getHearingActions} from "@/lib/hearingAction";
const SignButtonOrStatus = ({ userRole, doc, signingOne, handleSign, hearing_status, hearing_type }) => {
  const actions = getHearingActions(hearing_status, hearing_type, userRole);

  if (isSigned(doc)) {
    return <span className="text-sm text-green-600 font-medium">Signed</span>;
  }

  const canSign =
    canRegistrarOrClerkSign(userRole, doc) || canJudgeSign(userRole, doc);

  if (canSign && actions.showSignAll) {
    return (
      <button
        className="text-sm bg-primary-normal py-3 px-4 rounded-sm text-white hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handleSign(doc.id)}
        disabled={signingOne === doc.id}>
        {signingOne === doc.id ? "Signing..." : "Sign"}
      </button>
    );
  }

  return <span className="text-sm text-gray-500">{doc.document_status}</span>;
};

export default SignButtonOrStatus;
