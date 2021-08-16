import { SettingToggle, TextStyle } from "@shopify/polaris";

function ContactLensOrdersToggle({ orderToggle, handleToggle }) {
  const contentStatus = orderToggle ? "Unfulfilled" : "All";
  const textStatus = orderToggle ? "unfulfilled" : "all";

  return (
    <SettingToggle
      action={{
        content: contentStatus,
        onAction: handleToggle,
      }}
      enabled={orderToggle}
    >
      Showing <TextStyle variation="strong">{textStatus}</TextStyle> contact lens orders.
    </SettingToggle>
  );
}

export default ContactLensOrdersToggle;
