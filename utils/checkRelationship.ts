import { ContactType, Relationship } from "../sdk/db";

export const checkRelationship = (
  profile: ContactType | null | undefined,
  contact_id: string | null | undefined
) => {
  // Track relationship
  let relationship: Relationship = "none";

  // Start check
  if (profile && contact_id) {
    // -> User profile and contact profile fetched

    if (profile.contact.length > 0) {
      // -> User has contacts

      // Check if any of the user's contacts have id of contact
      for (let i = 0; i < profile.contact.length; i++) {
        if (profile.contact[i].data.id === contact_id) {
          // -> Found user in contact's contacts
          relationship = "full";
          break;
        }
      }
    }

    // Check for pending requests
    for (let i = 0; i < profile.requests_sent.length; i++) {
      if (profile.requests_sent[i].recipient_id === contact_id) {
        relationship = "pending";
        break;
      }
    }
  } // No relationship

  return relationship;
};
