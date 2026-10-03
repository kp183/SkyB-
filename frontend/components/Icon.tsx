import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
  size?: number | string;
}

export const Icon: React.FC<IconProps> = ({ name, className = "w-5 h-5", size, ...props }) => {
  const dimensionProps = size ? { width: size, height: size } : {};

  // Direct clean SVG paths for Material Symbols to guarantee zero FOUT/raw text flash
  switch (name) {
    case "shopping_bag":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12zm-7-8c-1.66 0-3-1.34-3-3H7c0 2.76 2.24 5 5 5s5-2.24 5-5h-2c0 1.66-1.34 3-3 3z" />
        </svg>
      );
    case "shopping_cart":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      );
    case "smart_toy":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 3h8v1.5H8V16z" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      );
    case "favorite":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
      );
    case "close":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      );
    case "person":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      );
    case "pin_drop":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M18 8c0-3.31-2.69-6-6-6S6 4.69 6 8c0 4.5 6 11 6 11s6-6.5 6-11zm-8 0c0-1.1.9-2 2-2s2 .9 2 2-.89 2-2 2c-1.1 0-2-.9-2-2zM5 20v2h14v-2H5z" />
        </svg>
      );
    case "expand_more":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
        </svg>
      );
    case "chevron_right":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      );
    case "arrow_forward":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </svg>
      );
    case "arrow_back":
    case "arrow_back_ios_new":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      );
    case "arrow_upward":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
        </svg>
      );
    case "verified_user":
    case "verified":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      );
    case "local_shipping":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      );
    case "sync_alt":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M18 14v-3H8v3l-4-4 4-4v3h10V6l4 4-4 4z" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    case "package_2":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M19.5 4h-15C3.12 4 2 5.12 2 6.5v11C2 18.88 3.12 20 4.5 20h15c1.38 0 2.5-1.12 2.5-2.5v-11C22 5.12 20.88 4 19.5 4zm-7.5 1.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm7.5 13h-15V9h15v9.5z" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      );
    case "grid_view":
    case "widgets":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M4 11h6V5H4v6zm0 8h6v-6H4v6zm8 0h6v-6h-6v6zm0-14v6h6V5h-6z" />
        </svg>
      );
    case "account_circle":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
      );
    case "category":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 2l-5.5 9h11z M17.5 17.5H14v-4h3.5zm-7 0H7v-4h3.5z M12 11.5l3.5 6h-7z" />
        </svg>
      );
    case "cake":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 1.3 10.29 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm6 3h-1V8c0-.55-.45-1-1-1H8c-.55 0-1 .45-1 1v1H6c-1.66 0-3 1.34-3 3v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.66-1.34-3-3-3zm1 11H5v-3h14v3zm0-5H5v-3c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v3z" />
        </svg>
      );
    case "local_fire_department":
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-9.99C8.58 3.82 4.41 8.87 4.5 13.77c.1 4.96 4.14 8.97 9.1 8.97 5.75 0 10.12-5.07 7.74-10.39H19.48zM13.5 20.73c-3.83 0-6.95-3.08-7-6.91-.04-2.85 1.76-5.52 3.96-7.17-.46 2.53 1.04 4.88 3.51 5.37 2.76.55 4.39-1.57 4.17-3.92 1.58 2.37 2.37 5.21 1.36 7.97-.99 2.74-3.52 4.66-6 4.66z" />
        </svg>
      );
    case "auto_awesome":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25z" />
        </svg>
      );
    case "redeem":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76V8h2v.76L15.38 12 17 10.83 14.92 8H20v6z" />
        </svg>
      );
    case "delete":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      );
    case "add":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      );
    case "remove":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M19 13H5v-2h14v2z" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      );
    case "boy":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 7h-2.5v13h-3V16h-1v6H7V9H5.5C4.67 9 4 8.33 4 7.5S4.67 6 5.5 6h13c.83 0 1.5.67 1.5 1.5S19.33 9 18.5 9H16z" />
        </svg>
      );
    case "girl":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm2.5 14.5v5.5h-2v-5.5h-1V22h-2v-5.5L7 9.5c-.38-.64-.17-1.47.47-1.85.64-.38 1.47-.17 1.85.47L11 11h2l1.68-2.88c.38-.64 1.21-.85 1.85-.47.64.38.85 1.21.47 1.85L14.5 16.5z" />
        </svg>
      );
    case "child_care":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M14.5 10.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm-5 0c0-.83-.67-1.5-1.5-1.5S6.5 9.67 6.5 10.5 7.17 12 8 12s1.5-.67 1.5-1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" />
        </svg>
      );
    case "baby_changing_station":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M14 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 0c1.1 0 2-.9 2-2S9.1 0 8 0 6 .9 6 2s.9 2 2 2zm13 14H3c-1.1 0-2 .9-2 2v2h22v-2c0-1.1-.9-2-2-2zM7 7c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1s1-.45 1-1V8c0-.55-.45-1-1-1zm10 0c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1s1-.45 1-1V8c0-.55-.45-1-1-1z" />
        </svg>
      );
    case "crib":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M18 9h-4V4c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v5H6c-1.1 0-2 .9-2 2v8h2v2h2v-2h8v2h2v-2h2v-8c0-1.1-.9-2-2-2zm-6 7H8v-4h4v4zm6 0h-4v-4h4v4z" />
        </svg>
      );
    case "soap":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M14 6c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm2 5.5c-.83 0-1.5-.67-1.5-1.5S15.17 8.5 16 8.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM12 11c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" />
        </svg>
      );
    case "medical_services":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10-2h4v2h-4V4zm6 9h-3v3h-2v-3H8v-2h3V8h2v3h3v2z" />
        </svg>
      );
    case "checklist":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M22 7h-9v2h9V7zm0 8h-9v2h9v-2zM5.54 11L2 7.46l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L5.54 11zm0 8L2 15.46l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41L5.54 19z" />
        </svg>
      );
    case "backpack":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M20 8v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8c0-1.86 1.28-3.41 3-3.86V2h10v2.14c1.72.45 3 2 3 3.86zM9 4v.1c.96-.07 1.98-.1 3-.1s2.04.03 3 .1V4H9zm9 6h-4v2h4v-2zm-6 4H6v4h12v-4h-6z" />
        </svg>
      );
    case "support_agent":
    case "help_center":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M21 12.22C21 6.73 16.74 3 12 3c-4.69 0-9 3.65-9 9.28-.6.34-1 .98-1 1.72v2c0 1.1.9 2 2 2h1v-6.1c0-3.87 3.13-7 7-7s7 3.13 7 7V19h-8v2h8c1.1 0 2-.9 2-2v-1.22c.59-.31 1-.92 1-1.64v-2.3c0-.7-.41-1.31-1-1.62zM9 13c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1zm6 0c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1z" />
        </svg>
      );
    case "logout":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
        </svg>
      );
    case "temp_preferences_custom":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V18h-2v-1.07c-2.83-.48-5-2.94-5-5.93 0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.99-2.17 5.45-5 5.93zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
        </svg>
      );
    case "steps":
    case "restaurant":
    case "bed":
    case "local_mall":
    default:
      // Fallback clean bullet/dot or tag icon (never raw text ligature)
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...dimensionProps} {...props}>
          <circle cx="12" cy="12" r="8" opacity="0.8" />
        </svg>
      );
  }
};

export default Icon;
