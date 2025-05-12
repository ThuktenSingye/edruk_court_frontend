/** @format */

export function getHearingActions(
  hearingStatus: string,
  hearingType: string,
  userRole: string
) {
  const actions = {
    showScheduleNext: false,
    showUploadDocument: false,
    showSignAll: false,
    showAddNote: false,
    showUpload: false,
  };

  if (hearingStatus === "completed") {
    return actions;
  }

  if (hearingType == "Miscellaneous") {
    if (userRole === "Judge") {
      actions.showSignAll = true;
      actions.showAddNote = true;
      actions.showUploadDocument = false;
    } else if (userRole == "Registrar") {
      actions.showScheduleNext = true;
      actions.showSignAll = true;
      actions.showAddNote = true;
      actions.showUploadDocument = true;
    }
    // Clerk = hide all
  } else {
    if (userRole === "Judge") {
      actions.showSignAll = true;
      actions.showAddNote = true;
      actions.showUploadDocument = false;
    } else if (userRole === "Clerk") {
      if (hearingType === "Judgement") {
        actions.showScheduleNext = false;
      } else {
        actions.showScheduleNext = true;
      }
      actions.showSignAll = true;
      actions.showAddNote = true;
      actions.showUpload = true;
      actions.showUploadDocument = true;
    }
  }

  return actions;
}
