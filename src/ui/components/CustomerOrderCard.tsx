export default function CustomerOrderCard({ customer }) {
  return (
    <div>
      <h2 className="py-5 text-2xl font-bold leading-6 text-gray-900">Customer Details</h2>
      <div className="flex py-5">
        <div className="w-1/2">
          <p className="py-2 text-lg leading-6 text-gray-900">
            {customer?.firstName} {customer?.lastName}
          </p>
          <p className="py-2 text-base leading-6 text-gray-600">{customer?.idNumber}</p>
          <p className="py-2 text-base leading-6 text-gray-600">
            <svg className="inline w-8 h-8 mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>{customer?.email}</span>
          </p>
          <p className="py-2 text-base leading-6 text-gray-600">
            <svg className="inline mr-2 text-gray-600 w-7 h-7" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>{customer?.addresses[0]?.phone}</span>
          </p>
        </div>
        <div className="w-1/2">
          <p className="py-2 text-base leading-6 text-gray-600">{customer?.addresses[0]?.address1}</p>
          {customer?.addresses[0]?.address2 && (
            <p className="py-2 text-base leading-6 text-gray-600">{customer?.addresses[0]?.address2}</p>
          )}
          {customer?.addresses[0]?.city && (
            <p className="py-2 text-base leading-6 text-gray-600">{customer?.addresses[0]?.city}</p>
          )}
          <p className="py-2 text-base leading-6 text-gray-600">{customer?.addresses[0]?.province}</p>
        </div>
      </div>
      <hr className="mt-2 border-gray-400" />
    </div>
  );
}
