import type { ShippingAddress } from '../types';

interface ShippingAddressCardProps {
  address: ShippingAddress;
  recipientName?: string;
}

export function ShippingAddressCard({
  address,
  recipientName,
}: Readonly<ShippingAddressCardProps>) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-secondary">location_on</span>
        <h3 className="text-body-lg font-semibold text-on-surface">Dirección de envío</h3>
      </div>

      <address className="text-body-md text-on-surface-variant not-italic">
        {recipientName && (
          <>
            <span className="text-on-surface font-semibold">{recipientName}</span>
            <br />
          </>
        )}
        {address.street}
        <br />
        {address.city}, {address.country}
        <br />
        {address.postalCode}
      </address>
    </div>
  );
}
