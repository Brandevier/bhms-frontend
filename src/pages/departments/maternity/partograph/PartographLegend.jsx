// components/maternity/PartographLegend.js
import React from "react";
import { Card } from "antd";

const PartographLegend = () => {
  return (
    <Card title="Partograph Guide" className="mt-6 shadow-md">
      <div className="space-y-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-0.5 bg-blue-500"></div>
          <span>
            <strong>Alert Line:</strong> Shows expected cervical dilatation
            (1 cm/hour). If labor progress crosses this line, closer
            monitoring is required.
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-6 h-0.5 bg-red-500"></div>
          <span>
            <strong>Action Line:</strong> 4 hours to the right of the Alert line.
            If progress crosses here, medical intervention is usually required.
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-black"></div>
          <span>
            <strong>Black Dots:</strong> Recorded cervical dilatation during
            labor (plotted against time).
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border border-gray-400"></div>
          <span>
            <strong>Grid Boxes:</strong> Each square represents 1 cm dilatation
            vertically and 1 hour horizontally.
          </span>
        </div>

        <p className="mt-4 text-gray-600">
          <strong>How to use:</strong> Plot cervical dilatation on the chart
          against time. Compare progress with the Alert and Action lines to
          decide on monitoring, referral, or intervention.
        </p>
      </div>
    </Card>
  );
};

export default PartographLegend;
