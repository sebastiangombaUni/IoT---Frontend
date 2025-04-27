import { useState } from "react";

function Tabs({ children, labels }: { children: React.ReactNode[]; labels: string[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex gap-4 border-b mb-4">
        {labels.map((label, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`pb-2 px-4 ${activeTab === i ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div>{children[activeTab]}</div>
    </div>
  );
}

export default Tabs;
