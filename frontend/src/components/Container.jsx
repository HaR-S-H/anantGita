import React from "react";

const Container = ({ children, height = "min-h-[80vh]", width = "max-w-4xl" }) => {
  return (
    <div className={`flex items-center justify-center ${height} w-full`}>
      <div className={`flex w-full ${width} rounded-xl overflow-hidden shadow-xl`}>
        {children}
      </div>
    </div>
  );
};

export default Container;
