import { clerkClient } from "@clerk/express";

const auth = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();

    if (!userId || !has) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const hasPremiumPlan = await has({ plan: "premium" });
    const user = await clerkClient.users.getUser(userId);

    let free_usage = user.privateMetadata?.free_usage ?? 0;

    if (!hasPremiumPlan && typeof free_usage === 'number') {
      req.free_usage = free_usage;
    } else if (!hasPremiumPlan) {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: 0 }
      });
      req.free_usage = 0;
    } else {
      // Premium users don't need free_usage tracking
      req.free_usage = null;
    }

    req.plan = hasPremiumPlan ? "premium" : "free";
    req.userId = userId; // Optional: if you want to access userId later in controller
    next();
  } catch (error) {
    console.error("auth middleware error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default auth;
