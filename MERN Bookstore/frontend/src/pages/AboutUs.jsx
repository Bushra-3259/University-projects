import React from "react";

const AboutUs = () => {
  // Data for the development team
  const teamMembers = [
    {
      name: "Sharmin Akter",
      details: "CSE, 54th Batch, Section 6CF",
    },
    {
      name: "Bushra",
      details: "CSE, 54th Batch, Section 6CF",
    },
    {
      name: "Jumana",
      details: "CSE, 54th Batch, Section 6CF",
    },
  ];

  // Data for the supervisor
  const supervisor = {
    name: "Sultana Tasnim",
    title: "Lecturer",
    department: "Dept. of CSE, IIUC",
  };

  return (
    <div className="bg-zinc-900 px-4 md:px-12 py-12 text-white min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-100 mb-12 text-center">
          About Our Project
        </h1>

        {/* Supervisor Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-yellow-100 mb-8 text-center">
            Project Supervisor
          </h2>
          <div className="max-w-md mx-auto bg-zinc-800 p-6 rounded-lg text-center shadow-lg">
            <div className="w-28 h-28 rounded-full bg-yellow-100 mx-auto flex items-center justify-center mb-4">
              <span className="text-5xl text-zinc-900 font-bold">
                {supervisor.name.charAt(0)}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">{supervisor.name}</h3>
            <p className="text-lg text-yellow-100 mt-1">{supervisor.title}</p>
            <p className="text-md text-zinc-300">{supervisor.department}</p>
          </div>
        </div>

        {/* Development Team Section */}
        <div className="border-t-2 border-zinc-700 pt-12">
          <h2 className="text-3xl font-semibold text-yellow-100 mb-8 text-center">
            Developed By
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-zinc-800 p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="w-24 h-24 rounded-full bg-zinc-700 mx-auto flex items-center justify-center mb-4">
                  <span className="text-4xl text-yellow-100 font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                <p className="text-md text-zinc-300 mt-2">{member.details}</p>
                <p className="text-sm text-zinc-400 mt-1">
                  International Islamic University Chittagong
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;