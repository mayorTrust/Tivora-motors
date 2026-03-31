import React from 'react';

const SpecRow = ({ label, value }) => (
  <div className="flex justify-between py-4 border-b border-foreground/5">
    <span className="text-sm text-foreground/60">{label}</span>
    <span className="text-sm font-bold text-foreground">{value}</span>
  </div>
);

const FullSpecsTable = ({ vehicle }) => {
  const specs = [
    { label: 'Brand', value: vehicle.brand },
    { label: 'Model', value: vehicle.name },
    { label: 'Year', value: vehicle.year },
    { label: 'Price', value: `$${vehicle.price.toLocaleString()}` },
    { label: 'Condition', value: vehicle.condition },
    { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} mi` },
    { label: 'Engine', value: vehicle.engine },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Color', value: vehicle.color },
    { label: 'Location', value: vehicle.location },
    { label: 'Category', value: vehicle.category },
  ];

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6 text-foreground">Full Specifications</h3>
      <div className="bg-foreground/5 p-6 rounded-2xl">
        {specs.map((spec, index) => (
          <SpecRow key={index} label={spec.label} value={spec.value} />
        ))}
      </div>
    </div>
  );
};

export default FullSpecsTable;
