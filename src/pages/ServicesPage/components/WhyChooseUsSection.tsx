import React from 'react';
import { WHY_CHOOSE_US } from '../constants';
import { WhyChooseUsItem } from './WhyChooseUsItem';

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          {WHY_CHOOSE_US.map((item, index) => (
            <WhyChooseUsItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

