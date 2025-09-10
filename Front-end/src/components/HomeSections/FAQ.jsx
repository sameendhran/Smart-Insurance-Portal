import React, { useState } from 'react';

const QA = [
  { q: 'Who can use the app?', a: 'Policyholders and authorized staff can access features based on their roles.' },
  { q: 'How do I reset my password?', a: 'Use the Forgot Password option on the login screen to reset securely.' },
  { q: 'How do I update personal details?', a: 'Navigate to Customer details to edit profile information with proper permissions.' },
];

export default function FAQ() {
  return (
    <section className="hm-faq">
      <h2>Frequently Asked Questions</h2>
      <div className="hm-faq-list">
        {QA.map((item, idx) => (
          <Item key={idx} question={item.q} answer={item.a} />
        ))}
      </div>
    </section>
  );
}

function Item({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`hm-faq-item ${open ? 'open' : ''}`}>
      <button className="hm-faq-q" onClick={() => setOpen(o => !o)}>
        <span>{question}</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="hm-faq-a">{answer}</div>}
    </div>
  );
}


