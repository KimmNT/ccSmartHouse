import mqtt from "mqtt";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const { state } = useLocation();

  const navigateToPage = (pageUrl, stateData) => {
    navigate(pageUrl, { state: stateData });
  };

  return (
    <div>
      <div onClick={() => navigateToPage("/detail")}>to detail</div>
    </div>
  );
}
