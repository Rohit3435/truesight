"use client";

import React from "react";
import Link from "next/link";

interface SmoothScrollLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  sectionId?: string;
}

export default function SmoothScrollLink({ 
  href, 
  className, 
  children, 
  sectionId 
}: SmoothScrollLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's an anchor link and we have a sectionId
    if (href.startsWith("#") && sectionId) {
      e.preventDefault();
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 100, // Offset for header
          behavior: 'smooth'
        });
      }
    }
    // Otherwise, let Link handle the navigation normally
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
