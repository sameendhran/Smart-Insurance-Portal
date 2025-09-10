import React from 'react';

const items = [
  {
    icon: '📄',
    title: 'View Policy Details',
    text: 'Access comprehensive policy information and coverage at a glance.'
  },
  {
    icon: '🧾',
    title: 'Make a Claim',
    text: 'Submit and track claims quickly with streamlined workflows.'
  },
  {
    icon: '👥',
    title: 'Manage Customers & Policies',
    text: 'Maintain customer data and policy lifecycles with ease.'
  },
  {
    icon: '🔍',
    title: 'Advanced Search',
    text: 'Filter data by gender, date range, policy type, and more.'
  }
];

export default function Features() {
  return (
    <section className="hm-features">
      <div className="hm-features-grid">
        {items.map((it, idx) => (
          <div className="hm-card" key={idx}>
            <div className="hm-card-icon">{it.icon}</div>
            <h3>{it.title}</h3>
            <p>{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


