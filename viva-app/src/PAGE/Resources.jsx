import React from "react";
import { BookOpen, Sparkles, Rocket } from "lucide-react";
import "../CSS/resources.css";

const Resources = () => {
  return (
    <div className="resources-container">
      <div className="resources-content">
        {/* Animated Icon */}
        <div className="resources-icon-wrapper">
          <div className="resources-icon-glow"></div>
          <div className="resources-icon-pulse"></div>
          <BookOpen size={120} className="resources-icon" />
          <div className="resources-live-dot"></div>
        </div>

        {/* Coming Soon Text */}
        <h1 className="resources-title">
          <Sparkles size={40} className="resources-sparkle" />
          Coming Soon
          <Sparkles size={40} className="resources-sparkle" />
        </h1>

        <p className="resources-subtitle">
          We're working on something amazing!
        </p>

        <div className="resources-description">
          <p>
            <Rocket size={20} className="resources-rocket" />
            The Resources section is under development and will be available soon.
          </p>
          <p>Stay tuned for exciting learning materials, guides, and more!</p>
        </div>

        {/* Animated Progress Bar */}
        <div className="resources-progress-container">
          <div className="resources-progress-bar">
            <div className="resources-progress-fill"></div>
          </div>
          <p className="resources-progress-text">Building something great...</p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="resources-bg-animation">
        <div className="resources-circle resources-circle-1"></div>
        <div className="resources-circle resources-circle-2"></div>
        <div className="resources-circle resources-circle-3"></div>
      </div>
    </div>
  );
};

export default Resources;
