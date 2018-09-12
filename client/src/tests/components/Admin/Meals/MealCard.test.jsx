/* eslint-disable no-undef */

import React from 'react';
import { render } from 'react-testing-library';
import MealCard from '../../../../components/Admin/Meals/MealCard';

describe('MealCard Component', () => {
  /** 
   * mealInfo values are set to null as focus is on
   * presentation not values displayed
   */
  const mealInfo = {
    vendor: {
      name: null,
      url: null
    }
  };

  const { container } = render(<MealCard {...mealInfo} />);
  it('should have image div', () => {
    const elements = container.getElementsByClassName('image');
    expect(elements.length).toBe(1);
  });

  it('should have label-container div', () => {
    const elements = container.getElementsByClassName('label-container');
    expect(elements.length).toBe(1);
  });

  it('should have details div', () => {
    const elements = container.getElementsByClassName('details');
    expect(elements.length).toBe(1);
  });

  it('should have controls div', () => {
    const elements = container.getElementsByClassName('controls');
    expect(elements.length).toBe(1);
  });
});
