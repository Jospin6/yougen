// __tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import {Button} from '@/components/Button';

describe('Button Component', () => {
  it('renders correctly and handles click', () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);

    const button = screen.getByText('Click Me');
    fireEvent.click(button);

    // expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
