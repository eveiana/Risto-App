/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export default function RistoLogo({
  size = "md",
  isDarkTheme = true,
  className = "",
}) {
  // Map preset sizes to height/width classes
  const sizeClasses = {
    xs: "h-6 w-auto",
    sm: "h-8 w-auto",
    md: "h-12 w-auto",
    lg: "h-16 w-auto",
    xl: "h-24 w-auto",
    custom: "",
  };

  const chosenSizeClass = sizeClasses[size] || sizeClasses.sm;

  // Set colors based on theme
  // In light theme: Page is light, circle is black, outside text is black, inside text is white.
  // In dark theme: Page is dark/black, circle is white, outside text is white, inside text is black.
  const circleColor = isDarkTheme ? "#ffffff" : "#000000";
  const outsideTextColor = isDarkTheme ? "#ffffff" : "#000000";
  const insideTextColor = isDarkTheme ? "#000000" : "#ffffff";

  // Unique ID for the clipPath to avoid collisions across multiple logo instances
  const clipId = React.useId().replace(/:/g, "-");

  return (
    <svg
      viewBox="0 0 215 90"
      className={`${chosenSizeClass} ${className} select-none shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2500/svg"
      role="img"
      aria-label="Risto Logo"
    >
      <defs>
        {/* Clip path representing the exact boundary of the circle */}
        <clipPath id={`risto-circle-clip-${clipId}`}>
          <circle cx="48" cy="45" r="37.5" />
        </clipPath>
      </defs>

      {/* 1. Base Circle */}
      <circle cx="48" cy="45" r="37.5" fill={circleColor} />

      {/* 2. Outside Text Layer (drawn in outside text color)
          Contains the full "Risto" allowing native font kerning and tracking */}
      <text
        x="33"
        y="66.5"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="700"
        fontSize="65"
        letterSpacing="-1.5px"
        fill={outsideTextColor}
      >
        Risto
      </text>

      {/* 3. Inside Clipped Text Layer (drawn in inside dark/light text color)
          Using the exact same dimensions, clipped to the circle to create the stencil illusion */}
      <g clipPath={`url(#risto-circle-clip-${clipId})`}>
        <text
          x="33"
          y="66.5"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontSize="65"
          letterSpacing="-1.5px"
          fill={insideTextColor}
        >
          Risto
        </text>
      </g>
    </svg>
  );
}
