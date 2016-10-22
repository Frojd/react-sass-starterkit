import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import TestComponent from './';
import data from './TestComponent.json';

describe('<TestComponent />', () => {
    it('Renders an empty TestComponent', () => {
        const wrapper = mount(<TestComponent />);
        expect(wrapper.find(TestComponent)).to.have.length(1);
    });

    it('Renders one full TestComponent', () => {
        const wrapper = mount(<TestComponent {...data} />);
        expect(wrapper.find(TestComponent)).to.have.length(1);
    });
});
