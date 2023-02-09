import { render, screen } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom'

test('App renders without failing.', () => {
  // test getting the whole thing to render and not failing.
  render(<App />);
  const linkElement = screen.getByText(/Galant/i);
  expect(linkElement).toBeInTheDocument();
});