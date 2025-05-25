import React from "react";
import PropTypes from "prop-types";

const Header = ({
  title = "AI Summarizer",
  className = "",
  variant = "primary",
}) => {
  // Define color variants for better theming
  const variants = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-600 text-white",
    success: "bg-green-500 text-white",
    dark: "bg-gray-900 text-white",
  };

  const baseClasses = "py-4 px-4 shadow-md transition-colors duration-200";
  const variantClasses = variants[variant] || variants.primary;
  const combinedClasses =
    `${baseClasses} ${variantClasses} ${className}`.trim();

  return (
    <header className={combinedClasses} role="banner" aria-label="Site header">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-3xl font-bold text-center sm:text-left"
          id="main-title"
        >
          {title}
        </h1>
      </div>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "dark"]),
};

export default React.memo(Header);
