"use client";

import { UserContext } from '@/app/_context/UserContext';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';

function History() {

  const convex = useConvex();
  const { userData } = useContext(UserContext);
  const [discussionRoomList, setDiscussionRoomList] = useState([]);

  useEffect(() => {
    if (userData) {
      GetDiscussionRooms();
    }
  }, [userData]);

  const GetDiscussionRooms = async () => {
    const result = await convex.query(api.DiscussionRoom.GetAllDiscussionRoom, {
      uid: userData?._id
    });
    setDiscussionRoomList(result);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className='font-bold font-outfit text-2xl text-white'>Recent Activity</h2>
        <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-widest">Archive</span>
      </div>
      
      {discussionRoomList?.length === 0 && (
        <div className="glass-card p-10 text-center">
            <h2 className='text-white/40 font-medium italic'>Your historical lab is empty...</h2>
        </div>
      )}

      <div className="grid gap-4">
        {discussionRoomList.map((item, index) => (
          <div key={index} className='glass-card p-4 group flex justify-between items-center hover:bg-white/[0.03] active:scale-[0.99] transition-all'>
            <div className='flex gap-5 items-center'>
              <div className="relative">
                <Image
                    src={'/ab1.png'}
                    alt='abs'
                    width={50}
                    height={50}
                    className='rounded-2xl h-[50px] w-[50px] object-cover ring-1 ring-white/10'
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div>
                <h2 className='font-bold text-white/90 group-hover:text-primary transition-colors'>{item.topic}</h2>
                <h2 className='text-white/40 text-xs uppercase tracking-tighter font-medium'>{item.coachingOptions}</h2>
              </div>
            </div>
            
            <Link href={'/view-summery/' + item._id}> 
              <button className='px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-primary hover:text-white transition-all border border-white/5'>
                 View Report
              </button>
            </Link>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
