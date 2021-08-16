import { SettingToggle, TextStyle } from "@shopify/polaris";
import createPersistedState from "use-persisted-state";

const useCounterState = createPersistedState("orders");

function ContactLensOrdersToggle({ toggleQueryType, getOrders }) {
  const [storedValue, setValue] = useCounterState(false);

  const handleToggle = () => {
    setValue((prevStoredValue) => !prevStoredValue);
    toggleQueryType(storedValue);
    getOrders();
  };

  const contentStatus = storedValue ? "Unfulfilled" : "All";
  const textStatus = storedValue ? "unfulfilled" : "all";

  return (
    <SettingToggle
      action={{
        content: contentStatus,
        onAction: handleToggle,
      }}
      enabled={storedValue}
    >
      Showing <TextStyle variation="strong">{textStatus}</TextStyle> contact lens orders.
    </SettingToggle>
  );
}

export default ContactLensOrdersToggle;
