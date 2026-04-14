"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import SummeryBox from "../_components/SummeryBox";

const CoachingOptions = [
  { name: "Interview Prep", abstract: "/abs1.png" },
  { name: "Language Learning", abstract: "/abs2.png" },
  { name: "Topic Discussion", abstract: "/abs3.png" },
  // Add any more options you have...
];

function ViewSummery() {
  const { roomid } = useParams();

  // Avoid running the query until roomid is ready
  const DiscussionRoomData = useQuery(
    api.DiscussionRoom.GetDiscussionRoom,
    roomid ? { id: roomid } : "skip"
  );

  if (!roomid) {
    return <div>Loading route...</div>;
  }

  if (DiscussionRoomData === undefined) {
    return <div>Loading discussion data...</div>;
  }

  const GetAbsImg = (option) => {
    const coachingOption = CoachingOptions.find((item) => item.name === option);
    return coachingOption?.abstract ?? "/ab1.png";
  };

  const usageStats = DiscussionRoomData?.usageStats;

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 glass-card p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
            <Image
            src={GetAbsImg(DiscussionRoomData?.coachingOptions)}
            alt="abstract"
            width={120}
            height={120}
            className="w-[100px] h-[100px] rounded-full border-2 border-white/10 relative object-cover"
            />
        </div>
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-primary font-bold uppercase tracking-[0.3em] text-xs">Performance Analysis</h2>
          <h1 className="font-bold text-4xl font-outfit text-white tracking-tight">
            {DiscussionRoomData?.topic}
          </h1>
          <h3 className="text-white/40 text-sm font-medium uppercase tracking-widest">
            {DiscussionRoomData?.coachingOptions} • Expert AI Evaluation
          </h3>
        </div>
      </div>

      {/* Summary Box Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-xl font-bold font-outfit text-white">Insight Dashboard</h2>
        </div>
        <SummeryBox summery={DiscussionRoomData.summery} />
      </div>

      {usageStats && (
        <div className="glass-card p-6 md:p-8 space-y-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-white font-bold font-outfit text-xl">Session Usage</h2>
              <p className="text-white/40 text-sm uppercase tracking-[0.2em] mt-1">
                Estimated AI load for this room
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary text-2xl font-bold">{usageStats.totalTokens.toLocaleString()}</p>
              <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Total Tokens</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Requests</p>
              <p className="text-white text-xl font-bold mt-2">{usageStats.requests}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Input</p>
              <p className="text-white text-xl font-bold mt-2">{usageStats.inputTokens.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Output</p>
              <p className="text-white text-xl font-bold mt-2">{usageStats.outputTokens.toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/40 text-xs uppercase tracking-[0.3em]">Est. Cost</p>
              <p className="text-white text-xl font-bold mt-2">${usageStats.estimatedCostUsd.toFixed(4)}</p>
            </div>
          </div>

          <p className="text-white/30 text-xs uppercase tracking-[0.2em]">
            Last model used: {usageStats.lastModel}
          </p>
        </div>
      )}
      
      <div className="flex justify-center pb-12">
          <p className="text-white/20 text-[10px] uppercase font-bold tracking-[0.5em]">Session Audit Log Complete</p>
      </div>
    </div>
  );
}

export default ViewSummery;
