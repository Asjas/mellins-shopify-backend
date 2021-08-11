import React, { useCallback } from "react";
import { SettingToggle, TextStyle } from "@shopify/polaris";
import createPersistedState from "use-persisted-state";

const useCounterState = createPersistedState("orders");

function ContactLensOrdersToggle() {
  const [storedValue, setValue] = useCounterState(false);

  const handleToggle = useCallback(() => {
    setValue((prevStoredValue) => !prevStoredValue);
  }, []);

  const contentStatus = storedValue ? "All" : "Unfulfilled";
  const textStatus = storedValue ? "all" : "unfulfilled";

  return (
    <SettingToggle
      action={{
        content: contentStatus,
        onAction: handleToggle,
      }}
      enabled={storedValue}
    >
      Showing <TextStyle variation="strong">{textStatus}</TextStyle> orders.
    </SettingToggle>
  );
}

export default ContactLensOrdersToggle;
