import OrderLineItem from "./OrderLineItem";

export default function ItemsOrderCard({ order }) {
  return (
    <div>
      <h2 className="mt-8 mb-4 text-2xl font-bold leading-6 text-gray-900">Order Details</h2>
      <p className="mt-6 mb-2 text-lg leading-4 text-gray-700">{order?.name}</p>
      <div className="flex flex-col">
        {order?.lineItems?.edges.map((lineItem) => (
          <OrderLineItem key={lineItem?.node?.id} item={lineItem} />
        ))}
      </div>
    </div>
  );
}
