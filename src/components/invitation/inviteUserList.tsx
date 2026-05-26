// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState } from "react";

// import { getAllUsers } from "../../app/services/userService";

// import { sendInvitation } from "../../app/services/invitationService";

// export default function InviteUserList({
//   eventId,
// }: {
//   eventId: string;
// }) {
//   const [users, setUsers] = useState<
//     any[]
//   >([]);

//   // LOAD USERS
//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const token =
//           localStorage.getItem("token");

//         if (!token) return;

//         const result =
//           await getAllUsers(token);
//         console.log("USERS:", result);
//         setUsers(result.data || []);

//       } catch (error) {
//         console.log(error);
//       }
//     };

//     loadUsers();
//   }, []);

//   // INVITE USER
//   const handleInvite = async (
//     userId: string
//   ) => {
//     try {
//       const token =
//         localStorage.getItem("token");

//       if (!token) {
//         alert("Login required");
//         return;
//       }

//       await sendInvitation(
//         eventId,
//         userId,
//         token
//       );

//       alert("Invitation sent");

//     } catch (error: any) {
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="space-y-3">

//       {users.map((user) => (
//         <div
//           key={user.id}
//           className="border p-4 rounded flex justify-between items-center"
//         >
//           <div>
//             <p className="font-semibold">
//               {user.name}
//             </p>

//             <p className="text-sm text-gray-500">
//               {user.email}
//             </p>
//           </div>

//           <button
//             onClick={() =>
//               handleInvite(user.id)
//             }
//             className="bg-black text-white px-4 py-2 rounded"
//           >
//             Invite
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { getAllUsers } from "../../app/services/userService";

import { sendInvitation } from "../../app/services/invitationService";

export default function InviteUserList({
  eventId,
}: {
  eventId: string;
}) {
  const [users, setUsers] = useState<any[]>(
    []
  );

  // LOAD USERS
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) return;

        const result =
          await getAllUsers(token);

        console.log(
          "USERS:",
          result
        );

        setUsers(result.data || []);

      } catch (error) {
        console.log(error);
      }
    };

    loadUsers();
  }, []);

  // INVITE USER
  const handleInvite = async (
    userId: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login");
        return;
      }

      await sendInvitation(
        eventId,
        userId,
        token
      );

      alert("Invitation sent");

    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-3">

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {user.name}
              </p>

              <p className="text-sm text-gray-500">
                {user.email}
              </p>
            </div>

            <button
              onClick={() =>
                handleInvite(user.id)
              }
              className="bg-black text-white px-4 py-2 rounded"
            >
              Invite
            </button>
          </div>
        ))
      )}
    </div>
  );
}