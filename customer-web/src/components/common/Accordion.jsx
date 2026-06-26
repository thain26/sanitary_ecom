import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div style={{ borderBottom: '1px solid var(--color-border)', marginBottom: '1rem' }}>
      <button
        onClick={onClick}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '1.1rem',
          fontWeight: 400,
          color: 'var(--color-primary)',
          textAlign: 'left',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        {title}
        {isOpen ? <ChevronUp size={20} color="var(--color-text-muted)" /> : <ChevronDown size={20} color="var(--color-text-muted)" />}
      </button>
      
      <div 
        style={{ 
          maxHeight: isOpen ? '1000px' : '0', 
          overflow: 'hidden', 
          transition: 'max-height 0.3s ease-in-out',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div style={{ paddingBottom: '1.5rem', paddingTop: '0.5rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0); // Mở sẵn tab đầu tiên

  return (
    <div className="accordion-container" style={{ marginTop: '2rem' }}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
