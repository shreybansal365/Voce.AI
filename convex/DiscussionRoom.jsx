import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewRoom=mutation({
    args:{
        coachingOptions: v.string(),
        topic: v.string(),
        expertName: v.string(),
        uid:v.id('users')
    },
    handler: async(ctx, args)=>{
        const result = await ctx.db.insert('DiscussionRoom', {
            coachingOptions:args.coachingOptions,
            topic: args.topic,
            expertName: args.expertName,
            uid: args.uid,
            usageStats: {
                requests: 0,
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
                estimatedCostUsd: 0,
                lastModel: "pending",
                lastUpdatedAt: Date.now()
            }
        });

        return result;
    }

})

export const UpdateUsageStats = mutation({
    args: {
        id: v.id('DiscussionRoom'),
        usage: v.object({
            model: v.string(),
            inputTokens: v.number(),
            outputTokens: v.number(),
            totalTokens: v.number(),
            estimatedCostUsd: v.number()
        })
    },
    handler: async (ctx, args) => {
        const room = await ctx.db.get(args.id);
        if (!room) return;

        const currentUsage = room.usageStats ?? {
            requests: 0,
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
            estimatedCostUsd: 0,
            lastModel: "pending",
            lastUpdatedAt: 0
        };

        await ctx.db.patch(args.id, {
            usageStats: {
                requests: currentUsage.requests + 1,
                inputTokens: currentUsage.inputTokens + args.usage.inputTokens,
                outputTokens: currentUsage.outputTokens + args.usage.outputTokens,
                totalTokens: currentUsage.totalTokens + args.usage.totalTokens,
                estimatedCostUsd: Number((currentUsage.estimatedCostUsd + args.usage.estimatedCostUsd).toFixed(6)),
                lastModel: args.usage.model,
                lastUpdatedAt: Date.now()
            }
        });
    }
})

export const GetDiscussionRoom=query({
    args: {
        id: v.id('DiscussionRoom')
    },
    handler: async (ctx,args) => {
        const result = await ctx.db.get(args.id);
        return result;
    }
});

export const UpdateConversation=mutation({
    args:{
        id:v.id('DiscussionRoom'),
        conversation:v.any()
    },
    handler: async(ctx,args)=>{
        await ctx.db.patch(args.id, {
            conversation:args.conversation
        })
    }
})

export const UpdateSummery=mutation({
    args:{
        id:v.id('DiscussionRoom'),
        summery:v.any()
    },
    handler: async(ctx,args)=>{
        await ctx.db.patch(args.id, {
            summery:args.summery
        })
    }
})


export const GetAllDiscussionRoom = query({
    args: {
        uid: v.id('users')
    },
    handler: async (ctx,args) => {
        const result = await ctx.db.query('DiscussionRoom')
        .filter(q => q.eq(q.field('uid'), args.uid)).collect();

        return result;
    }
})
