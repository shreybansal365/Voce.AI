import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        credits: v.number(),
        subID: v.optional(v.string())
    }),

    DiscussionRoom: defineTable({
        coachingOptions: v.string(),
        topic: v.string(),
        expertName: v.string(),
        conversation: v.optional(v.any()),
        summery: v.optional(v.any()),
        uid: v.optional(v.id('users')),
        usageStats: v.optional(v.object({
            requests: v.number(),
            inputTokens: v.number(),
            outputTokens: v.number(),
            totalTokens: v.number(),
            estimatedCostUsd: v.number(),
            lastModel: v.string(),
            lastUpdatedAt: v.number()
        }))
    })
})
