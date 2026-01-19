import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConsentProvider } from '../../contexts/consent/ConsentProvider';
import { ConsentContext } from '../../contexts/consent/ConsentContext';
import Cookies from 'js-cookie';

// Mock js-cookie
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Mock BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  constructor(name: string) {
    this.name = name;
  }
  postMessage() {}
  close() {}
}
globalThis.BroadcastChannel = MockBroadcastChannel as unknown as typeof BroadcastChannel;

describe('ConsentProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    return (
      <ConsentContext.Consumer>
        {(value) => (
          <div>
            <div data-testid="consent-status">{value?.consent}</div>
            <div data-testid="banner-status">{value?.isBannerOpen ? 'open' : 'closed'}</div>
            <button onClick={() => value?.setConsent('granted')}>Grant</button>
            <button onClick={() => value?.setConsent('denied')}>Deny</button>
          </div>
        )}
      </ConsentContext.Consumer>
    );
  };

  it('initializes with unknown and open banner if no cookie exists', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    expect(screen.getByTestId('consent-status')).toHaveTextContent('unknown');
    expect(screen.getByTestId('banner-status')).toHaveTextContent('open');
  });

  it('initializes with granted and closed banner if cookie exists', () => {
    (Cookies.get as jest.Mock).mockReturnValue('granted');

    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    expect(screen.getByTestId('consent-status')).toHaveTextContent('granted');
    expect(screen.getByTestId('banner-status')).toHaveTextContent('closed');
  });

  it('updates consent and cookie when setConsent is called', () => {
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    render(
      <ConsentProvider>
        <TestComponent />
      </ConsentProvider>
    );

    act(() => {
      screen.getByText('Grant').click();
    });

    expect(screen.getByTestId('consent-status')).toHaveTextContent('granted');
    expect(screen.getByTestId('banner-status')).toHaveTextContent('closed');
    expect(Cookies.set).toHaveBeenCalledWith(
      'benhickman_consent_v1',
      'granted',
      expect.any(Object)
    );
  });
});
