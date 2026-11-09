import fc from 'fast-check';

import { parseDeepLink } from '../deepLinks';

describe('parseDeepLink', () => {
  it('accepts only documented CatChain routes', () => {
    expect(parseDeepLink('https://catchain.app/pets/pet_123')).toEqual({
      route: 'PetDetail',
      params: { petId: 'pet_123' },
    });
    expect(parseDeepLink('catchain://appointments/apt-123')).toEqual({
      route: 'Appointments',
      params: { appointmentId: 'apt-123' },
    });
    expect(parseDeepLink('catchainapp:///sos/sos123')).toEqual({
      route: 'Emergency',
      params: { sosId: 'sos123' },
    });
  });

  it('rejects arbitrary hosts for otherwise valid paths', () => {
    fc.assert(
      fc.property(fc.domain(), fc.constantFrom('pets', 'appointments', 'sos'), (host, route) => {
        fc.pre(host.toLowerCase() !== 'catchain.app');
        return parseDeepLink(`https://${host}/${route}/identifier`) === null;
      }),
    );
  });

  it('rejects unknown paths and malformed identifiers', () => {
    fc.assert(
      fc.property(fc.string(), (suffix) =>
        parseDeepLink(`https://catchain.app/unknown/${encodeURIComponent(suffix)}`) === null,
      ),
    );
    expect(parseDeepLink('https://catchain.app/pets/id/records/record')).toBeNull();
    expect(parseDeepLink('https://catchain.app/pets/%2F%2Fevil')).toBeNull();
  });

  it('rejects credentials, ports, query parameters, and fragments', () => {
    expect(parseDeepLink('https://user@catchain.app/pets/p1')).toBeNull();
    expect(parseDeepLink('https://catchain.app:8443/pets/p1')).toBeNull();
    expect(parseDeepLink('https://catchain.app/pets/p1?next=https://evil.example')).toBeNull();
    expect(parseDeepLink('https://catchain.app/pets/p1#profile')).toBeNull();
  });
});