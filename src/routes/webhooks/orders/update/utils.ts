export const calculateDefaultValues = (metafields) => {
  if (metafields.edges.length === 0) return null;

  const metafieldObject = metafields.edges.reduce((accum, currentValue) => {
    const { key, value } = currentValue.node;

    accum[key] = value;

    return accum;
  }, {});

  return metafieldObject;
};

export const getOptomName = async (data) => {
  if (!data.metafields) return null;

  const metafieldObject = await calculateDefaultValues(data.metafields);

  if (metafieldObject && metafieldObject.optomName) {
    return metafieldObject.optomName;
  }

  return null;
};

export const getOrderApproved = async (data) => {
  if (!data.metafields) return null;

  const metafieldObject = await calculateDefaultValues(data.metafields);

  if (metafieldObject && metafieldObject.orderApproved === "Yes") {
    return true;
  }

  return false;
};

export const getOrderStatusReady = async (data) => {
  if (!data.metafields) return null;

  const metafieldObject = await calculateDefaultValues(data.metafields);

  if (
    (metafieldObject && metafieldObject.orderStatus === "Ready for pickup") ||
    (metafieldObject && metafieldObject.orderStatus === "Ready")
  ) {
    return true;
  }

  return false;
};

export const getIBTRequested = async (data) => {
  if (!data.metafields) return null;

  const metafieldObject = await calculateDefaultValues(data.metafields);

  if (metafieldObject && metafieldObject.ibtRequested === "Yes") {
    return true;
  }

  return false;
};

export const getRefundRequested = async (data) => {
  if (!data.metafields) return null;

  const metafieldObject = await calculateDefaultValues(data.metafields);

  if (metafieldObject && metafieldObject.refundRequested === "Yes") {
    return true;
  }

  return false;
};

export const getVoucherRequested = async (data) => {
  if (!data.metafields) return null;

  const metafieldObject = await calculateDefaultValues(data.metafields);

  if (metafieldObject && metafieldObject.eyeTestVoucher === "Yes") {
    return true;
  }

  return false;
};
