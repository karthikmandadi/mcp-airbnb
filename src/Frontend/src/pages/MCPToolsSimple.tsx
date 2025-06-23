import React from 'react';

const MCPToolsSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MCP Tools Test</h1>
          <p className="text-gray-600 mt-2">
            Simple MCP Tools page to test rendering
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>This is a simple test component to isolate rendering issues.</p>
        </div>
      </div>
    </div>
  );
};

export default MCPToolsSimple;
