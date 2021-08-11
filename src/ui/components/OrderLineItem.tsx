export default function OrderLineItem({ item }) {
  return (
    <div>
      <p className="pb-3 mt-6 text-lg leading-6 text-gray-900">{item?.node?.name}</p>
      {item?.node?.vendor && <p className="leading-6 text-gray-400 text-tiny">Vendor: {item.node.vendor}</p>}
      {item?.node?.customAttributes?.map((customAttribute) => (
        <p key={customAttribute.key} className="pt-1 text-sm leading-8 text-gray-500">
          <span className="text-gray-700">{customAttribute.key}:</span> {customAttribute.value}
        </p>
      ))}
      {item?.node?.customAttributes.length > 0 && <hr className="mt-6 border-gray-400" />}
    </div>
  );
}
