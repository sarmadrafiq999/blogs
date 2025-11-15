// pages/api/user.js

import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { userId, sessionId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  return res.status(200).json({
    message: "Authenticated",
    userId,
    sessionId,
  });
}
