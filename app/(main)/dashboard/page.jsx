'use client';


import React from "react";
import AppHeader from "../_components/AppHeader";
import FeatureAssistants from "./_conponents/FeatureAssistants";
import History from "./_conponents/History";
import Feedback from "./_conponents/Feedback";

function Dashboard() {
    return(
        <div>
            <FeatureAssistants />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
                <History />
                
            </div>
        </div>
    )
}

export default Dashboard;