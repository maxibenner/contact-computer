import {
  ContactType,
  Relationship,
  TransformedConnectionType,
} from "../sdk/db";

export const checkRelationship = (
  profile: ContactType | null | undefined,
  contact: ContactType | null | undefined
) => {
  // Track relationship
  let relationship: Relationship = null;

  // Start check
  if (profile) {
    // -> User profile fetched
    if (contact) {
      // -> Contact fetched
      if (contact.contact.length > 0) {
        // -> Contact has contacts
        // Check if any of the contact's contacts is user
        contact.contact.forEach((contact) => {
          if (contact.contact.id === profile.id) {
            // -> Found user in contact's contacts
            if (contact.follows_contact && contact.contact_follows) {
              relationship = "full";
            }
            // -> Connected both ways
            if (contact.follows_contact) {
              relationship = "follower";
            }
            // -> Only follows user
            if (contact.contact_follows) {
              relationship = "following";
            }
            // -> User only follows
          } else {
            // -> User not found in contact's contacts
            relationship = "none";
          }
        });
      }

      // Check for pending requests
      for (let i = 0; i < contact.requests_sent.length; i++) {
        if (contact.requests_sent[i].owner.id === profile.id) {
          relationship = "requesting";
          break;
        }
      }

      // No relationship exists
    } else relationship = "none"; // No relationship
  }

  return relationship;
};

// export const checkRelationshipWithoutLoop = (
//   profile: ContactType | null | undefined,
//   contact: TransformedConnectionType | null | undefined
// ) => {
//   // Track relationship
//   let relationship: Relationship = null;

//   // Start check
//   if (profile) {
//     // -> User profile fetched
//     if (contact) {
//       // -> Contact fetched

//       if (contact.contact.id === profile.id) {
//         // -> Found user in contact's contacts
//         if (contact.follows_contact && contact.contact_follows) {
//           relationship = "full";
//         }
//         // -> Connected both ways
//         if (contact.follows_contact) {
//           relationship = "follower";
//         }
//         // -> Only follows user
//         if (contact.contact_follows) {
//           relationship = "following";
//         }
//         // -> User only follows
//       } else {
//         // -> User not found in contact's contacts
//         relationship = "none";
//       }

//       // No relationship exists
//     } else relationship = "none"; // No relationship
//   }

//   return relationship;
// };
